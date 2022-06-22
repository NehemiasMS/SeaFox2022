import pyautogui
import os
from time import sleep
import webbrowser as browser


my_browser = browser.get('windows-default')
my_browser.open_new('file:///C:/projects/ROV/tests/GUI/html/index.html')

list = os.listdir('C:/projects/ROV/tests/GUI/python shit/screenshots') # dir is your directory path
number_files = len(list)
print (number_files)

path4screenshot = "C:/projects/ROV/tests/GUI/python shit/screenshots" + str(number_files) + ".png"
print(path4screenshot)
sleep(1)

myScreenshot = pyautogui.screenshot(region=(125, 165, 545, 308))
#myScreenshot.save(r'C:/projects/ROV/tests/GUI/python shit/screenshots/screenshots0.png')
#myScreenshot.save(f"{path4screenshot}")

myScreenshot.save(rf"C:\projects\ROV\tests\GUI\python shit\screenshots\img{number_files}.png")