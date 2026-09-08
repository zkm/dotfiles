function ollama-clean --description 'Cleanup (interactive, no fzf required)'
    echo "🗑️  Removing model: $argv[1]"
    if test -z "$argv[1]"
        echo "Usage: ollama-clean <model_name>"
        return 1
    end
    ollama rm "$argv[1]"
end
