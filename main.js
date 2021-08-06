const scrolltoDiv = (div, isSidebar) => {
  if (isSidebar) {
    $(".container").removeClass("container__open");
    $(".sidebar-menu").removeClass("sidebar-menu__open");
  }

  $("html, body").animate(
    {
      scrollTop: $(`#${div}`).offset().top,
    },
    1000
  );
};

const openSidebar = () => {
  $(".container").addClass("container__open");
  $(".sidebar-menu").addClass("sidebar-menu__open");
};

const closeSidebar = () => {
  $(".container").removeClass("container__open");
  $(".sidebar-menu").removeClass("sidebar-menu__open");
};
