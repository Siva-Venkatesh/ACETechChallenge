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

    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      await page
        .locator(
          "//a[@href='https://www.gobusiness.gov.sg/business-grants-portal-faq/get-a-grant/']"
        )
        .click(),
    ]);

    await newPage.waitForLoadState();

    //await expect(page.locator("//b[contains(text(),'Get a Grant')]")).toBeVisible();
    //await newPage.close();

    await page.locator("(//span[contains(text(),'Yes')])[4]").click();

    await page.locator("(//span[contains(text(),'Yes')])[5]").click();

    //AC 5: Clicking ‘Save’ will save the Applicant’s inputs and refreshing the page
    await page.locator("//button[@id='save-btn']").click();

    await expect(page.locator("//div[@id='growls']")).toBeVisible();

    await page.locator("//button[@id='next-btn']").click();
  });


  //User Story 2 – Contact Details Section starts here..
  test("AC_03_Provide Your Contact Details", async () => {
    //AC 1: The page contains a ‘Main Contact Person’ subsection with the following inputs:
    await page.fill("//input[@id='react-contact_info-name']", "testName");

    await page.fill(
      "//input[@id='react-contact_info-designation']",
      "testJobTitle"
    );

    await page.fill("//input[@id='react-contact_info-phone']", "73763838");

    await page.fill(
      "//input[@id='react-contact_info-primary_email']",
      "testEmail@gmail.com"
    );

    //AC 3: Alternatively, there should be a checkbox ‘Same as registered address in Company Profile’
    await page
      .locator(
        "//span[normalize-space()='Same as registered address in Company Profile']"
      )
      .click();

    //AC 5: There should be an option ‘ Same as main contact person’ which will populate the subsection  
    await page
      .locator("//span[normalize-space()='Same as main contact person']")
      .click();

    //AC 6: Clicking ‘Save’ will save the Applicant’s inputs and refreshing the page  
    await page.locator("//button[@id='save-btn']").click();

    await expect(page.locator("//div[@id='growls']")).toBeVisible();

    await page.locator("//button[@id='next-btn']").click();
  });

  //Submit Your Proposal starts here..
  test("AC_04_Submit Your Proposal", async () => {

    await page.fill("//input[@id='react-project-title']", "testProjectTitle");

    await page.fill("//input[@id='react-project-start_date']", "25 Sep 2024");

    await page.fill("//input[@id='react-project-end_date']", "25 Dec 2024");

    await page.screenshot({
      path: "testData/screenshots/StartnEnd Date.png",
    });

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

    await page.fill(
      "//textarea[@id='react-project_impact-rationale_remarks']",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapib0"
    );
    await page.waitForTimeout(3000);

    await page.screenshot({
      path: "testData/screenshots/numberCharacters.png",
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

    const fileChooserPromise = page.waitForEvent("filechooser");
    await page
      .locator("//button[@name='react-project_cost-vendors-0-attachments-btn']")
      .click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles("./testData/file-sample_150kB.pdf");

    await page.waitForTimeout(7000);

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

  
  //User Story 3 (EPIC) – Form Submission - Declare & Acknowledge Term starts here..
  test("AC_07_Declare and Acknowledge Terms", async () => {

    // AC 1: Upon filling all mandatory inputs in all 6 form sections and clicking the ‘Review’ button
    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='No'])[1]")
      .click();

    await page
      .locator("(//span[@class='bgp-label'][normalize-space()='Yes'])[2]")
      .click();

    await page.fill(
      "//textarea[@id='react-declaration-civil_proceeding_remarks']",
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapib0"
    );

    await page.waitForTimeout(3000);

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

    //AC 4: At the bottom of the read-only summary page is a final ‘Consent and Acknowledgement’ checkbox.  
    await page
      .locator("//input[@id='react-declaration-consent_acknowledgement_check']")
      .click();

    await page.locator("//button[@id='save-btn']").click();
    await page.waitForTimeout(3000);

    await page.locator("//button[@id='review-btn']").click();
    await page.waitForTimeout(3000);

    await page
      .locator("//*[@id='react-declaration-info_truthfulness_check']")
      .click();

    await page.locator("//*[@id='submit-btn']").click();
    await page.waitForTimeout(7000);

    await page.screenshot({
      path: "testData/screenshots/ApplicationSubmitted.png",
    });

    //AC 5: Once checked, the Applicant can submit the entire Application and a Success message box
    const submitVerification = page.locator(
      "//h3[normalize-space()='Your application has been submitted.']"
    );
    await expect(submitVerification).toHaveValue(
      "Your application has been submitted");
    await page.waitForTimeout(3000);
  });
});
