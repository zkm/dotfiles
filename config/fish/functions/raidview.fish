function raidview --description 'Comprehensive RAID status viewer'
    set -l c_reset ''
    set -l c_bold ''
    set -l c_dim ''
    set -l c_cyan ''
    set -l c_green ''
    set -l c_yellow ''
    set -l c_red ''
    set -l colors_n 0
    if test -z "$NO_COLOR"; and isatty stdout; and command -v tput >/dev/null 2>&1
        set colors_n (tput colors 2>/dev/null)
        test -z "$colors_n"; and set colors_n 0
    end
    if test "$colors_n" -ge 8
        set c_reset (tput sgr0)
        set c_bold (tput bold)
        set c_dim (tput dim)
        set c_cyan (tput setaf 6)
        set c_green (tput setaf 2)
        set c_yellow (tput setaf 3)
        set c_red (tput setaf 1)
    end

    set -l mddev ""
    if test -e /proc/mdstat
        set mddev (grep -Eo '^md[0-9]+' /proc/mdstat | head -n1)
    end
    if test -z "$mddev"; and command -v lsblk >/dev/null 2>&1
        set mddev (lsblk -rno NAME,TYPE | awk '$2=="raid5"{print $1; exit}')
    end

    set -l title "RAID Status"
    test -n "$mddev"; and set title "RAID Status — /dev/$mddev"
    set -l border (printf '─%.0s' (seq 1 (math (string length -- $title) + 2)))
    echo "$c_bold$c_cyan╭$border╮$c_reset"
    echo "$c_bold$c_cyan│ $title │$c_reset"
    echo "$c_bold$c_cyan╰$border╯$c_reset"

    if not test -e /proc/mdstat
        echo "$c_yellow⚠️  No Linux md RAID subsystem detected (/proc/mdstat missing).$c_reset"
    else
        echo "$c_bold📋 mdstat$c_reset"
        sed -E \
            -e "s/\[U+\]/$c_green&$c_reset/" \
            -e "s/\[[U_]*_[U_]*\]/$c_red&$c_reset/" \
            -e "s/^(.*(resync|recovery|check|reshape) =.*)\$/$c_yellow\1$c_reset/" \
            /proc/mdstat

        if test -z "$mddev"
            echo -e "\n$c_yellow⚠️  No md raid device detected.$c_reset"
        else if not command -v mdadm >/dev/null 2>&1
            echo -e "\n$c_yellow⚠️  mdadm is not installed; can't show detail for /dev/$mddev.$c_reset"
        else
            set -l detail (sudo mdadm --detail /dev/$mddev 2>/dev/null)

            set -l state_line (string join \n -- $detail | grep -m1 "State :" | sed -E 's/^ *State : *//')
            set -l badge
            set -l badge_color
            switch $state_line
                case clean "clean "
                    set badge HEALTHY
                    set badge_color $c_green
                case "*degraded*" "*recovering*"
                    set badge DEGRADED
                    set badge_color $c_red
                case "*checking*" "*resync*"
                    set badge CHECKING
                    set badge_color $c_yellow
                case '*'
                    set badge $state_line
                    set badge_color $c_yellow
            end
            echo -e "\n$c_bold●$c_reset $badge_color$c_bold$badge$c_reset $c_dim($state_line)$c_reset"

            echo -e "\n$c_bold$c_cyan🔍 Array Detail$c_reset"
            for line in (string join \n -- $detail | grep -E "Raid Level|Array Size|State :|Active Devices|Working|Failed|Spare")
                switch $line
                    case "*State*clean*" "*State*active*"
                        printf '  %s%s%s\n' "$c_green" "$line" "$c_reset"
                    case "*State*degraded*" "*State*recovering*" "*State*resync*" "*State*checking*"
                        printf '  %s%s%s\n' "$c_yellow" "$line" "$c_reset"
                    case "*Failed Devices*: 0"
                        printf '  %s%s%s\n' "$c_green" "$line" "$c_reset"
                    case "*Failed Devices*"
                        printf '  %s%s%s\n' "$c_red" "$line" "$c_reset"
                    case '*'
                        printf '  %s\n' "$line"
                end
            end

            set -l disk_table (string join \n -- $detail | awk '/Number +Major +Minor +RaidDevice +State/{f=1} f && NF')
            if test -n "$disk_table"
                echo -e "\n$c_bold$c_cyan💿 Member Disks$c_reset"
                for line in $disk_table
                    switch $line
                        case "*Number*Major*Minor*RaidDevice*State*"
                            printf '  %s%s%s\n' "$c_dim" "$line" "$c_reset"
                        case "*faulty*" "*removed*"
                            printf '  %s%s%s\n' "$c_red" "$line" "$c_reset"
                        case "*spare*" "*rebuilding*" "*recovering*"
                            printf '  %s%s%s\n' "$c_yellow" "$line" "$c_reset"
                        case "*active*sync*"
                            printf '  %s%s%s\n' "$c_green" "$line" "$c_reset"
                        case '*'
                            printf '  %s\n' "$line"
                    end
                end
            end

            set -l df_line (df -h --output=size,used,avail,pcent,target /dev/$mddev 2>/dev/null | tail -n1)
            if test -n "$df_line"
                set -l size used avail pcent target
                echo $df_line | read -l size used avail pcent target
                set -l pct_num (string replace -- '%' '' $pcent)
                set -l filled (math --scale=0 $pct_num / 10)
                set -l empty (math --scale=0 10 - $filled)
                set -l bar (printf '█%.0s' (seq 1 $filled) 2>/dev/null)(printf '░%.0s' (seq 1 $empty) 2>/dev/null)
                set -l bar_color $c_green
                test "$pct_num" -ge 80; and set bar_color $c_yellow
                test "$pct_num" -ge 95; and set bar_color $c_red
                echo -e "\n$c_bold$c_cyan📦 Array Capacity$c_reset $c_dim($target)$c_reset"
                printf '  %s[%s]%s %s  (%s used, %s free of %s)\n' \
                    "$bar_color" "$bar" "$c_reset" "$pcent" "$used" "$avail" "$size"
            end
        end
    end

    if command -v lsblk >/dev/null 2>&1
        echo -e "\n$c_bold$c_cyan💽 Storage Devices$c_reset"
        lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,MOUNTPOINT
    end

    echo -e "\n$c_bold$c_cyan📈 Disk Usage$c_reset"
    if test (uname) = Darwin
        df -h
    else
        df -h -x tmpfs -x devtmpfs
    end
end
