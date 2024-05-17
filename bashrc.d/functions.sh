# Functions
proj() {
  cd ~/projects/"$1"
}
mkcd() {
  mkdir -p "$1"
  cd "$1"
}
serve() {
  local port=${1:-8000}
  python -m http.server "$port"
}

# Extract various archive formats
extract() {
  if [ -f $1 ]; then
    case $1 in
      *.tar.bz2)   tar xjf $1   ;;
      *.tar.gz)    tar xzf $1   ;;
      *.bz2)       bunzip2 $1   ;;
      *.rar)       unrar x $1   ;;
      *.gz)        gunzip $1    ;;
      *.tar)       tar xf $1    ;;
      *.tbz2)      tar xjf $1   ;;
      *.tgz)      tar xzf $1   ;;
      *.zip)       unzip $1     ;;
      *.Z)         uncompress $1;;
      *.7z)        7z x $1      ;;
      *)           echo "'$1' cannot be extracted via extract()" ;;
    esac
  else
    echo "'$1' is not a valid file"
  fi
}

# Function to get the current version of a command if it's available
get_version() {
  if command -v "$1" &> /dev/null; then
    echo "$($1 --version | awk '{print $NF}' | head -n 1)"
  fi
}
