from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils import join_game

# Start game with full table test


players = []

for i in range(4):
    players.append(join_game("John" + str(i), i))
    
driver = players[0]

button = WebDriverWait(driver, 10).until(
EC.element_to_be_clickable((By.CSS_SELECTOR, ".start-button"))
)


button.click()
try:
    

    WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/bidding'))
    assert driver.current_url == 'http://localhost:3000/bidding', "Starting game alone failed"
    
except AssertionError as e:
    print(e)
finally:
    for player in players:
        player.quit()
