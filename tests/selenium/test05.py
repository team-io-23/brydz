from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils import setup_game

# Pass bidding test

players = setup_game()

button = WebDriverWait(players[0], 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, ".pass.none")))

try:
    for _ in range(3):
        button.click()

    driver = players[0]
    button_grid = WebDriverWait(driver, 10).until(EC.invisibility_of_element_located((By.CLASS_NAME, "bidding-options")))
    assert button_grid, "Button grid is still visible."

except AssertionError as e:
    print(e)

finally:
    for player in players:
        player.quit()