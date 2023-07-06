from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils import setup_game
import time
# Play card and see if small table has 4 cards test

players = setup_game()

button = WebDriverWait(players[0], 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, ".pass.none")))

try:
    for _ in range(3):
        button.click()

    player = players[0]
    leftmost_card = player.find_element(By.CSS_SELECTOR, ".li-southHand:first-child .card")
    leftmost_card.click()
    
    player = players[3]
    leftmost_card = player.find_element(By.CSS_SELECTOR, ".li-northHandDummy:first-child .card")
    leftmost_card.click()
    
    player = players[2]
    leftmost_card = player.find_element(By.CSS_SELECTOR, ".li-southHand:first-child .card")
    leftmost_card.click()
    
    player = players[3]
    leftmost_card = player.find_element(By.CSS_SELECTOR, ".li-southHand:first-child .card")
    leftmost_card.click()
    
    driver = players[0]    
    played_spaces = driver.find_elements(By.CSS_SELECTOR, "[class^='played-space-small-']")

    # Assert that there are 4 played spaces
    assert len(played_spaces) == 4, "There are not 4 played spaces"
       

except AssertionError as e:
    print(e)

finally:
    for player in players:
        player.quit()