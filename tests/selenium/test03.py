from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Start game alone test

driver = webdriver.Firefox()

driver.get("http://localhost:3000")

name_input = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, ":r1:"))
)

name_input.send_keys("John")


join_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, ".StartPage-JoinButton"))
)

join_button.click()

WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/waitingRoom'))

seat_button = WebDriverWait(driver, 10).until(
EC.element_to_be_clickable((By.CSS_SELECTOR, ".eastButton.seatButton"))
)
seat_button.click()

try:
    
    button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, ".start-button"))
    )
    button.click()

    WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/bidding'))
    assert driver.current_url == 'http://localhost:3000/bidding', "Starting game alone failed"
    
except AssertionError as e:
    print(e)
finally:
    driver.quit()