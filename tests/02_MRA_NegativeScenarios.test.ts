import { test, expect, Page } from "@playwright/test";

let page: Page;

test.describe("Market Readiness Assistance grant booking", () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  //Accessing the BGP grant portal starts here..
  test("AC_01_login", async () => {
    await page.goto("https://qa-internet.bgp.onl/");

    await page.fill("(//input[@id='signInFormUsername'])[2]", "temp-govtech");

    await page.fill(
      "(//input[@id='signInFormPassword'])[2]",
      "bgPB3Aw3SomeGvtF@lk!"
    );

    await page.locator("(//input[@name='signInSubmitButton'])[2]").click();

    await page.waitForSelector("//div[@id='login-button']");

    await page.locator("//div[@id='login-button']").click();

    await expect(page.getByText("Manual Log In")).toBeVisible();

    await page.waitForSelector("//input[@id='entityId']");

    await page.fill("//input[@id='entityId']", "BGPQETECH");
    await page.fill("//input[@id='userId']", "S1234567A");
    await page.fill("//input[@id='userRole']", "Acceptor");
    await page.fill("//input[@id='userFullName']", "Tan Ah Kow");
    await page.locator("//button[normalize-space()='Log In']").click();

    await expect(
      page.locator(
        "//div[@id='grants']//h3[contains(text(),'What would you like to do?')]"
      )
    ).toBeVisible({ timeout: 500000 });

    await page.locator("//h4[normalize-space(text())='Get new grant']").click();

    await expect(page.locator("//div[contains(text(),'IT')]")).toBeVisible();

    await page.locator("//div[contains(text(),'IT')]").click();

    await expect(
      page.locator("//h3[normalize-space()='I need this grant to']")
    ).toBeVisible();

    await page
      .locator(
        "//div[normalize-space()='Bring my business overseas or establish a stronger international presence']"
      )
      .click();

    await expect(
      page.locator(
        "//h3[normalize-space()='What do you plan to do overseas with this grant?']"
      )
    ).toBeVisible();

    await page
      .locator("//div[normalize-space()='Market Readiness Assistance']")
      .click();

    await page.locator("//button[@id='go-to-grant']").click();

    await expect(
      page.locator(
        "//h1[normalize-space()='Market Readiness Assistance (MRA)']"
      )
    ).toBeVisible();

    await expect(
      page.locator("//h3[normalize-space()='Application Form']")
    ).toBeVisible();

    await page.locator("//button[@id='keyPage-form-button']").click();
  });

  //Check Your Eligibility starts here..
  test("AC_02_Check Your Eligibility", async () => {
    //AC 1: The section should contain 5 questions
    await expect(
      page.locator("//h2[normalize-space()='Check Your Eligibility']")
    ).toBeVisible();

    await page.locator("(//span[contains(text(),'Yes')])[1]").click();

    await page.locator("(//span[contains(text(),'Yes')])[2]").click();

    await page.locator("(//span[contains(text(),'No')])[3]").click();

    //AC 3: Answering No for any of the questions should display a warning message ‘The applicant may not meet the eligibility criteria for this grant
    await expect(
      page.locator(
        "//span[contains(text(),'The applicant may not meet the eligibility criteri')]"
      )
    ).toBeVisible();

    await page.locator("(//span[contains(text(),'Yes')])[4]").click();

    await page.locator("(//span[contains(text(),'Yes')])[5]").click();

    //AC 5: Clicking ‘Save’ will save the Applicant’s inputs and refreshing the page
    await page.locator("//button[@id='save-btn']").click();

    await expect(page.locator("//div[@id='growls']")).toBeVisible();

    await page.locator("//button[@id='next-btn']").click();
  });

  //Provide Your Contact Details starts here..
  test("AC_03_Provide Your Contact Details", async () => {
    await page.fill("//input[@id='react-contact_info-name']", "testName");

    await page.fill(
      "//input[@id='react-contact_info-designation']",
      "testJobTitle"
    );

    //Passing invalid phone number
    await page.fill("//input[@id='react-contact_info-phone']", "893874");
    const inValidContactNumber = page.locator(
      "//p[@id='react-contact_info-phone-alert']"
    );
    await expect(inValidContactNumber).toHaveText(
      /Oops, that’s not an 8-digit Singapore contact number/
    );

    //Passing invalid email ID
    await page.fill(
      "//input[@id='react-contact_info-primary_email']",
      "testGmail.com"
    );

    const inValidEmailID = page.locator(
      "(//p[@id='react-contact_info-primary_email-alert'])[1]"
    );
    await expect(inValidEmailID).toHaveText(
      /Oops, that doesn't seem like a valid email address/
    );

    await page
      .locator(
        "//span[normalize-space()='Same as registered address in Company Profile']"
      )
      .click();

    await page
      .locator("//span[normalize-space()='Same as main contact person']")
      .click();

    await page.locator("//button[@id='save-btn']").click();

    await expect(page.locator("//div[@id='growls']")).toBeVisible();

    await page.locator("//button[@id='next-btn']").click();
  });

  //Submit Your Proposal starts here..
  test("AC_04_Submit Your Proposal", async () => {
    await page.fill("//input[@id='react-project-title']", "testProjectTitle");

    //Validating with "Back dated" start date
    await page.fill("//input[@id='react-project-start_date']", "23 Sep 2023");
    const backDatedStartDate = page.locator(
      "//p[@id='react-project-start_date-alert']"
    );
    await expect(backDatedStartDate).toHaveText(/Must be today or later/);

    await page.screenshot({
      path: "testData/screenshots/backDated_StartDate.png",
    });

    await page.fill("//input[@id='react-project-end_date']", "25 Dec 2024");

    await page.fill(
      "//textarea[@id='react-project-description']",
      "testProject Description from the Submit Your Proposal page"
    );

    await page.waitForSelector(
      "//span[@id='react-select-project-activity--value']//div[@class='Select-placeholder'][normalize-space()='Select...']"
    );

    await page.click(
      "//span[@id='react-select-project-activity--value']//div[@class='Select-placeholder'][normalize-space()='Select...']"
    );

    await page.type(
      "//span[@id='react-select-project-activity--value']//input",
      "Market Entry"
    );

    await page.press(
      "//span[@id='react-select-project-activity--value']//input",
      "Enter"
    );

    await page.locator("//span[normalize-space()='Yes']").click();

    await page.waitForSelector(
      "//span[@id='react-select-project-primary_market--value']//div[@class='Select-placeholder'][normalize-space()='Select...']"
    );

    await page.click(
      "//span[@id='react-select-project-primary_market--value']//div[@class='Select-placeholder'][normalize-space()='Select...']"
    );

    await page.type(
      "//span[@id='react-select-project-primary_market--value']//input",
      "Singapore"
    );

    await page.press(
      "//span[@id='react-select-project-primary_market--value']//input",
      "Enter"
    );

    await page.locator("//span[normalize-space()='Yes']").click();

    await page.fill(
      "//textarea[@id='react-project-remarks']",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapib0"
    );

    await page.locator("//button[@id='save-btn']").click();
    await page.waitForTimeout(7000);

    await page.locator("//button[@id='next-btn']").click();
    await page.waitForTimeout(3000);
  });

  //Explain The Business Impact starts here..
  test("AC_05_Business Impact", async () => {
    await page.fill(
      "//input[@id='react-project_impact-fy_end_date_0']",
      "28 Sep 2024"
    );

    await page.fill(
      "//input[@id='react-project_impact-overseas_sales_0']",
      "100"
    );

    await page.fill(
      "//input[@id='react-project_impact-overseas_sales_1']",
      "200"
    );

    await page.fill(
      "//input[@id='react-project_impact-overseas_sales_2']",
      "300"
    );

    await page.fill(
      "//input[@id='react-project_impact-overseas_sales_3']",
      "400"
    );

    await page.fill(
      "//input[@id='react-project_impact-overseas_investments_0']",
      "500"
    );

    await page.fill(
      "//input[@id='react-project_impact-overseas_investments_1']",
      "600"
    );

    await page.fill(
      "//input[@id='react-project_impact-overseas_investments_2']",
      "700"
    );

    await page.fill(
      "//input[@id='react-project_impact-overseas_investments_3']",
      "800"
    );

    // Validating more than 500 characters in the "Rationale projection" text box
    await page.fill(
      "//textarea[@id='react-project_impact-rationale_remarks']",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justduo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras daptest Loreem"
    );
    await page.waitForTimeout(2000);
    const exceedingChar = page.locator(
      "//p[@id='react-project_impact-rationale_remarks-alert']"
    );
    await expect(exceedingChar).toHaveText(
      /Your entry shouldn't be more than 500 characters/
    );

    await page.screenshot({
      path: "testData/screenshots/exceedingNumberCharacters.png",
    });

    await page.fill(
      "//textarea[@id='react-project_impact-benefits_remarks']",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapib0"
    );
    await page.waitForTimeout(3000);

    await page.locator("//button[@id='save-btn']").click();
    await page.waitForTimeout(7000);

    await page.locator("//button[@id='next-btn']").click();
    await page.waitForTimeout(3000);
  });

  //Provide Details of Costs starts here..
  test("AC_06_Provide Details of Costs", async () => {
    await page
      .locator("//div[normalize-space()='Third Party Vendors']")
      .click();

    await page
      .locator("//button[@id='react-project_cost-vendors-add-item']")
      .click();
    await page.waitForTimeout(2000);

    await page.locator("//span[normalize-space()='Singapore']").click();

    await page.fill(
      "//input[@id='react-project_cost-vendors-0-vendor_name']",
      "TEST PNP"
    );
    await page.waitForTimeout(7000);

    await page
      .locator("//span[@class='glyphicon glyphicon-search search-icon-logo']")
      .click();

    await page.locator("(//span[@id='vendor-row-sub'])[1]").click();
    await page.waitForTimeout(7000);

    await expect(
      page.locator(
        "//button[@id='react-project_cost-vendors-0-attachments-btn']"
      )
    ).toBeVisible();

    // Validating file size which is more than 20MB _ exceeding limit
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page
      .locator("//button[@name='react-project_cost-vendors-0-attachments-btn']")
      .click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles("./testData/20MB-TESTFILE.ORG.pdf");
    await page.waitForTimeout(3000);

    const exceedingFileSize = page.locator(
      "//span[normalize-space()='File size exceeds allowable limit']"
    );
    await expect(exceedingFileSize).toHaveText(
      /File size exceeds allowable limit/
    );

    await exceedingFileSize.scrollIntoViewIfNeeded();

    await page.screenshot({
      path: "testData/screenshots/unSupportedFileSize.png",
    });

    // Validating Un-supprted file type while uploading
    const unSupportedFileChooser = page.waitForEvent("filechooser");
    await page
      .locator("//button[@name='react-project_cost-vendors-0-attachments-btn']")
      .click();
    const fileChooserUnsupported = await unSupportedFileChooser;
    await fileChooser.setFiles("./testData/file-sample_100kB.rtf");
    await page.waitForTimeout(3000);

    const unSupportedFileType = page.locator(
      "//span[normalize-space()='File type is not supported']"
    );
    await expect(unSupportedFileType).toHaveText(/File type is not supported/);

    await unSupportedFileType.scrollIntoViewIfNeeded();

    await page.screenshot({
      path: "testData/screenshots/unSupportedFileType.png",
    });

    await page.fill(
      "//input[@id='react-project_cost-vendors-0-amount_in_billing_currency']",
      "1000"
    );

    await page.fill(
      "//textarea[@id='react-project_cost-vendors-0-remarks']",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapib0"
    );
    await page.waitForTimeout(3000);

    await page.locator("//button[@id='save-btn']").click();
    await page.waitForTimeout(3000);

    await page.locator("//button[@id='next-btn']").click();
    await page.waitForTimeout(3000);
  });

  //Declare & Acknowledge Term starts here..
  test("AC_07_Declare and Acknowledge Terms", async () => {
    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='No'])[1]")
      .click();

    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='Yes'])[2]")
      .click();

    // Validating more than 500 characters in the civil suit or proceedings in any jurisdiction in the last 5 years in text box
    await page.fill(
      "//textarea[@id='react-declaration-civil_proceeding_remarks']",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justduo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras daptest Loreem"
    );
    await page.waitForTimeout(2000);
    const exceedingChar = page.locator(
      "//p[@id='react-declaration-civil_proceeding_remarks-alert']"
    );
    await expect(exceedingChar).toHaveText(
      /Your entry shouldn't be more than 500 characters/
    );

    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='No'])[3]")
      .click();

    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='No'])[4]")
      .click();

    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='No'])[5]")
      .click();

    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='No'])[6]")
      .click();

    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='No'])[7]")
      .click();

    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='No'])[8]")
      .click();

    await page.locator("//button[@id='review-btn']").click();

    await page.waitForTimeout(20000);

    await page.locator("//button[@id='back-btn']").scrollIntoViewIfNeeded();

    const unCheckedAcknowledge = page.locator(
      "//p[@id='react-declaration-consent_acknowledgement_check-alert']"
    );

    await expect(unCheckedAcknowledge).toHaveText(
      /Acknowledge and consent to the terms to proceed/
    );

    await page.screenshot({
      path: "testData/screenshots/unCheckedAcknowledge.png",
    });
  });
});
