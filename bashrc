# If not running interactively, don't do anything
[[ $- != *i* ]] && return

# Source all files in ~/.bashrc.d
for file in ~/.bashrc.d/*.sh; do
  [ -r "$file" ] && source "$file"
done
