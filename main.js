const scrolltoDiv = (div) => {
  // let element = document.getElementById(div);
  // element.scrollIntoView({ behavior: "smooth" });

  $("html, body").animate(
    {
      scrollTop: $(`#${div}`).offset().top,
    },
    1000
  );
};
