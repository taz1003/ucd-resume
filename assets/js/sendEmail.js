function sendMail(contactForm) {
  emailjs
    .send("service_xe3eg9i", "rosie", {
      from_name: contactForm.name.value,
      email: contactForm.emailaddress.value,
      project_request: contactForm.projectsummary.value,
    })
    .then(
      function (response) {
        console.log("SUCCESS", response);
      },
      function (error) {
        console.log("FAILED", error);
      }
    );
    // return false; // To block from loading a new page
}
