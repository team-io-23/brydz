from selenium import webdriver
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Join menu test

options = Options()
options.add_argument("--headless")
driver = webdriver.Firefox(options=options)

driver.get("http://localhost:3000")

# Step 1: sign in
name_input = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, ":r1:"))
)
name_input.send_keys("John")

join_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, ".StartPage-JoinButton"))
)
join_button.click()

# Step 2: create a room
create_room_button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, ".create-room-button"))
)
create_room_button.click()

try:
    WebDriverWait(driver, 10).until(EC.url_to_be('http://localhost:3000/#/waitingRoom'))
    assert driver.current_url == 'http://localhost:3000/#/waitingRoom', "Redirection to waiting room failed"
except AssertionError as e:
    raise(e)
finally:
    driver.quit()
