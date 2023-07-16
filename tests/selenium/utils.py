from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver import FirefoxOptions

# Start game alone test

seats = ["south", "west", "north", "east"]

def create_driver():
    opts = FirefoxOptions()
    opts.add_argument("--headless")
    return webdriver.Firefox(options=opts)

def join_game(name, seatNr):
    driver = create_driver()
    
    driver.get("http://localhost:3000")
    WebDriverWait(driver,10).until(EC.presence_of_element_located((By.ID, ":r1:"))).send_keys(name)
    WebDriverWait(driver,10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".StartPage-JoinButton"))).click()
    WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/waitingRoom'))
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "." + seats[seatNr] + "Button.seatButton"))).click()

    return driver

def setup_game():
    players = []

    for i in range(4):
        players.append(join_game("John" + str(i), i))
        
    driver = players[0]

    button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, ".start-button"))
    )
    button.click()
    WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/bidding'))
    return players