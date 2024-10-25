//Adding click event on trash icon to delete habit and reloading table
$(document).on("click", ".fa-trash-can", async function () {
  await $.post("/deleteHabit", {
    id: $(this).data("value"),
  });
  $("table").load(location.href + " table");
});

//Adding click event on pencil icon to edit habit
$(document).on("click", ".fa-pen-to-square", async function () {
    let numHabit = $(this).data("value");
    //Making form visible
    $(".form" + numHabit).toggleClass("hide");
    $(".habit" + numHabit).toggleClass("hide");
});
  
//Adding click event to plus sign to expose form for new habit
$(document).on("click", ".fa-plus", async function () {
  $("form").toggleClass("hide");
  $(".fa-minus").toggleClass("hide");
  $(".fa-plus").toggleClass("hide");
});

//Adding click event to minus sign to remove form for new habit
$(document).on("click", ".fa-minus", async function () {
  $("form").toggleClass("hide");
  $(".fa-minus").toggleClass("hide");
  $(".fa-plus").toggleClass("hide");
});
