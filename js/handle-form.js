const formD = document.getElementById("myForm");

formD.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(this);
  const endpoint = formData.get('id') ? "./src/update-form.php" : "./src/save-form.php";

  fetch(endpoint, {
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

async function loadStudent() {
  const studentId = document.getElementById('searchId').value;
  if(!studentId || isNaN(studentId)) {
    alert('Please enter a valid student ID');
    return;
  }

  try {
    const response = await fetch(`./src/get_student.php?id=${studentId}`);
    const text = await response.text();
    
    if (!text) {
      throw new Error('Server error');
    }

    const data = JSON.parse(text);
    
    if(data.status === 'success') {
      const student = data.data;
      formD.reset();
      
      // Clear previous preview
      const preview = document.getElementById('profilePreview');
      preview.style.display = 'none';
      preview.src = '#';
      document.getElementById('existingProfile').value = '';
      
      // Populate form fields
      document.getElementById('studentId').value = student.id;
      document.getElementById('fullname').value = student.fullname;
      document.getElementById('class').value = student.stdclass;
      document.getElementById('roll').value = student.roll;
      document.getElementById('father').value = student.father;
      document.getElementById('address').value = student.address;
      document.getElementById('mobile').value = student.mobile;
      
      // Handle profile image
      if(student.profile) {
        document.getElementById('existingProfile').value = student.profile;
        preview.src = `./public/images/${student.profile}`;
        preview.style.display = 'block';
      }
      
      alert('Student loaded');
    } else {
      throw new Error(data.message || 'Error loading student');
    }
  } catch (error) {
    alert(error.message);
  }
}

function previewImage(input) {
    const preview = document.getElementById('profilePreview');
    const file = input.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        reader.readAsDataURL(file);
    } else {
        preview.src = '#';
        preview.style.display = 'none';
    }
}
