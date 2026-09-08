function docker-restart
    docker-stop
    sleep 2
    docker-start
end
