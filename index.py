import json
from flask import Flask, request, render_template, jsonify
from datetime import timedelta
import random
import time
import threading
from threading import Timer

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = timedelta(seconds=1)
json_data = ""
userName = {}
checkUserLiveT = ""
@app.route("/showPage", methods=['GET', 'POST'])
def showPage():
    if request.method == "POST":
        return json.dumps(json.load(open("data.json")))
    return render_template("hw2.html")

@app.route("/", methods=['GET', 'POST'])
def index():
    if request.method == "POST":
        event = request.form["event"]
        newData = request.form["newData"]
        newData = json.loads(newData)
        newName = request.form["userName"];
        print("event="+event)
        if(event == "getUserName"):
            setInterval(checkUserLive, 10, 1)
            newName = "".join(random.sample(['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'], 20)).replace(" ","")
            userName[newName] = {}
            userName[newName]["data"] = {}
            return newName
        if(event == "sendData"):
            userName[newName]["time"] = time.time()
            margeData(userName[newName]["data"], newData)
            print(userName[newName]["data"])
            return newName
    return render_template("hw1.html")
def hello():
    print("hello world")
def checkUserLive():
    print("checkUserLive")
    delUser = []
    for i in userName:
        if("time" in userName[i]):
            if(time.time() - userName[i]["time"] > 11):
                saveToJSONFile("data.json", userName[i]["data"])
                delUser.append(i)
    for i in delUser:
        del userName[i]
def saveToJSONFile(path, newData):
    print("saveToJSONFile")
    json_data = json.load(open(path))
    margeData(json_data, newData)
    with open(path, 'w') as fp:
        json.dump(json_data, fp)
def margeData(save, data):
    if isinstance(data,dict):
        for i in data:
            if i in save:
                if margeData(save[i], data[i]):
                    save[i] += data[i]
            else:
                save[i] = data[i]
                continue
        return False
    if isinstance(data,int):
        return True

setIntervalCount = {}
def setInterval(func, time, count):
    print("setInterval")
    if(count in setIntervalCount):
        print("return")
        return
    setIntervalCount[count] = True
    def threadStart():
        e = threading.Event()
        while not e.wait(time):
            func()
    Timer(0.0, threadStart).start()
if __name__ == "__main__":
    app.run()
