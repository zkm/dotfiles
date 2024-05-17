# Source the git-prompt script if available
if [ -f /usr/share/git/completion/git-prompt.sh ]; then
  source /usr/share/git/completion/git-prompt.sh
fi

# Function to get the current version of a command if it's available
get_version() {
  if command -v "$1" &> /dev/null; then
    "$1" --version | awk 'NR==1{print $NF}' # Get the first line version output
  fi
}

# Define the symbols for each segment
house_icon=""
clock_icon=""
branch_icon=""
python_icon=""
ruby_icon=""
node_icon=""
arch_icon=""

# Colors
RESET='\033[0m'
BG_BLUE='\033[44m'
FG_WHITE='\033[97m'
BG_GRAY='\033[100m'
FG_BLACK='\033[30m'
BG_GREEN='\033[42m'
BG_RED='\033[41m'
BG_YELLOW='\033[43m'
BG_PURPLE='\033[45m'

# Construct the left prompt with Arch icon, home/folder icon, and Git branch
construct_lprompt() {
  local lprompt=""

  local current_dir="$(pwd)"
  local home_dir="${HOME}"

  if [[ "${current_dir}" == "${home_dir}" ]]; then
    current_dir="~"
  elif [[ "${current_dir}" == "${home_dir}/"* ]]; then
    current_dir="~${current_dir#${home_dir}}"
  fi

  lprompt+="${BG_PURPLE}${FG_WHITE} ${arch_icon} ${RESET}"
  lprompt+="${BG_BLUE}${FG_WHITE} ${house_icon} ${current_dir} ${RESET}"

  if git rev-parse --is-inside-work-tree &> /dev/null; then
    lprompt+="${BG_BLUE}${FG_WHITE} $(__git_ps1 " ${branch_icon} %s") ${RESET}"
  fi

  echo -ne "${lprompt}"
}

# Construct the right prompt with language versions and time
construct_rprompt() {
  local rprompt=""

  local pyv=$(get_version python)
  if [ -n "$pyv" ]; then
    rprompt+="${BG_GREEN}${FG_BLACK} ${python_icon} ${pyv} ${RESET}"
  fi

  local rbv=$(get_version rbenv)
  if [ -n "$rbv" ]; then
    rbv=$(rbenv version | awk '{print $1}')
    rprompt+="${BG_RED}${FG_BLACK} ${ruby_icon} ${rbv} ${RESET}"
  fi

  local ndv=$(get_version node)
  if [ -n "$ndv" ]; then
    rprompt+="${BG_YELLOW}${FG_BLACK} ${node_icon} ${ndv} ${RESET}"
  fi

  rprompt+="${BG_GRAY}${FG_BLACK} ${clock_icon} $(date +%H:%M) ${RESET}"

  echo -ne "${rprompt}"
}

# Custom Prompt
PS1=''

# Set the right prompt
PROMPT_COMMAND='LPROMPT=$(construct_lprompt); RPROMPT=$(construct_rprompt); printf "\033[s\033[999C\033[100D%s\033[u" "${RPROMPT}"; printf "\033[s\033[0G%s\033[u" "${LPROMPT}"'

# Add a new line for the prompt
PS1+="\n❯ "

# Apply the custom prompt
export PS1
