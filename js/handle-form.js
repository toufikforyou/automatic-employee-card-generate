const formD = document.getElementById("myForm");

formD.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);

  fetch("./src/save-form.php", {
    method: "post",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      if (data.status === "success") {
        alert(data.message);
        formD.reset();
        location.href = `./students.php?id=${data.data.uid}`;
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`There was an error with the request. ${error}`);
    });
});
