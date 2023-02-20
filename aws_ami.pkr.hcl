variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-0dfcb1ef8550277af"
}

variable "ssh_username" {
  type    = string
  default = "ec2-ssh"
}

variable "subnet_id" {
  type    = string
  default = "subnet-0c6ed0855cdf72f89"
}

source "amazon-ebs" "my_ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY-MM-DD-hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE6225"

  ami_regions = [
    "us-east-1",
    "us-west-2"
  ]

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  subnet_id     = "${var.subnet_id}"

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = "8"
    volume_type           = "gp2"
  }
}


build {
  sources = ["amazon-ebs.my_ami"]

  provisioner "shell" {
    script = "./script.sh"
  }
}