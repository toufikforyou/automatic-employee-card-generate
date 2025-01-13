const formD = document.getElementById("myForm");

formD.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch("/generate", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        alert(data.message);
        formD.reset();
        location.href = "/students";
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
