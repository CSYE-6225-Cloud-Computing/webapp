
environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]


inline = [
      "sudo apt-get update",
      "sudo apt-get upgrade -y",
      "sudo apt-get install nginx -y",
      "sudo apt-get clean"
    ]