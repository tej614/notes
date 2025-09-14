let isAdmin = false;

function loadSubjectPage(subjectKey) {
  const listDiv = document.getElementById("resourcesList");
  let resources = JSON.parse(localStorage.getItem(subjectKey) || "[]");

  function render() {
    listDiv.innerHTML = "";
    if (resources.length === 0) {
      listDiv.innerHTML = "<p>No resources uploaded yet.</p>";
      return;
    }

    resources.forEach((res, index) => {
      const div = document.createElement("div");
      div.className = "resource-item";
      div.innerHTML = `<b>${res.lesson}</b><br>`;

      // Show all PDFs
      if (res.files && res.files.length > 0) {
        res.files.forEach((fileURL, i) => {
          const a = document.createElement("a");
          a.href = fileURL;
          a.download = `${res.lesson}_PDF${i + 1}.pdf`; // Download filename includes lesson
          a.target = "_blank";
          a.textContent = `📄 PDF ${i + 1}`;
          a.style.marginRight = "10px";
          div.appendChild(a);
        });
      }

      // Admin delete
      if (isAdmin) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "❌ Delete";
        delBtn.className = "delete-btn";
        delBtn.onclick = () => {
          if (confirm("Delete this lesson and all files?")) {
            resources.splice(index, 1);
            localStorage.setItem(subjectKey, JSON.stringify(resources));
            render();
          }
        };
        div.appendChild(delBtn);
      }

      listDiv.appendChild(div);
    });
  }

  render();

  // Upload handling
  const form = document.getElementById("uploadForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const lesson = document.getElementById("lessonName").value;
    const fileInput = document.getElementById("fileInput");

    if (!fileInput.files.length) {
      alert("Please select at least one PDF.");
      return;
    }

    let fileURLs = [];
    for (let i = 0; i < fileInput.files.length; i++) {
      const file = fileInput.files[i];
      if (file.type === "application/pdf") {
        fileURLs.push(URL.createObjectURL(file));
      } else {
        alert("Only PDF files are allowed!");
      }
    }

    resources.push({ lesson, files: fileURLs });
    localStorage.setItem(subjectKey, JSON.stringify(resources));
    form.reset();
    render();
  });

  // Admin login
  const adminBtn = document.getElementById("adminLoginBtn");
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      const pwd = prompt("Enter admin password:");
      if (pwd === "admin123") {
        isAdmin = true;
        alert("✅ Admin mode enabled!");
        render();
      } else {
        alert("❌ Wrong password!");
      }
    });
  }
}
