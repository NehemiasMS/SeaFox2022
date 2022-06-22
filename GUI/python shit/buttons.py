import tkinter

def takeScreenshotFunction():
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
    sleep(3)

    myScreenshot = pyautogui.screenshot(region=(125, 165, 545, 308))

    myScreenshot.save(rf"C:\projects\ROV\tests\GUI\python shit\screenshots\img{number_files}.png")

window = tkinter.Tk()
window.geometry("193x80+1325+710")

takeScreenshot = tkinter.Button(
    text="Take Screenshot",
    width=12,
    height=5,
    bg="blue",
    fg="yellow",
    command=takeScreenshotFunction
)

createMosaic = tkinter.Button(
    text="Create Mosaic",
    width=12,
    height=5,
    bg="blue",
    fg="yellow",
)

takeScreenshot.place(x = 0, y = 0)
createMosaic.place(x = 98, y = 0)

window.mainloop()