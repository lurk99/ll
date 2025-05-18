const scriptURL = 'https://script.google.com/macros/s/AKfycbzSa6S9jKN62aMB-HOaWOaimSsoLumvQZ_8Fylv2hZweGnX3g6_z2rJWkyaN-9adeUkcQ/exec'; // Gantikan dengan URL sebenar anda

function isNumeric(str) {
  return /^\d+$/.test(str);
}

function submitForm(event) {
  event.preventDefault();

  const unit = document.getElementById("unit").value;
  const jalan = document.getElementById("jalan").value;
  const telefonInput = document.getElementById("telefon");
  let telefon = telefonInput.value.trim();
  const pilihan = document.getElementById("pilihan").value;
  const alasan = document.getElementById("alasan").value.trim();
  const emel = document.getElementById("emel").value.trim();

  if (!emel) {
    alert("Sila isi emel anda.");
    return;
  }

  if (!isNumeric(telefon)) {
    alert("Sila masukkan nombor telefon tanpa simbol, ruang atau huruf.");
    return;
  }

  if (telefon.length < 9 || telefon.length > 15) {
    alert("Nombor telefon mesti antara 9 hingga 15 digit.");
    return;
  }

  const formData = new FormData();
  formData.append("unit", unit);
  formData.append("jalan", jalan);
  formData.append("telefon", telefon);
  formData.append("pilihan", pilihan);
  formData.append("alasan", alasan);
  formData.append("emel", emel);

  fetch(scriptURL, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "not_found") {
        alert("Maklumat tidak padan.");
        document.getElementById("undiForm").reset();
      } else if (data.status === "duplicate") {
        alert("Unit rumah anda telah mengundi.");
        document.getElementById("undiForm").reset();
      } else if (data.status === "success") {
        alert("Undian berjaya direkodkan.\nKod Unik Anda: " + data.kod);
        document.getElementById("undiForm").reset();
      } else {
        alert("Ralat: " + data.status);
      }
    })
    .catch((err) => {
      alert("Ralat sistem: " + err.message);
    });
}

function toggleAlasan(select) {
  const alasanDiv = document.getElementById("alasanDiv");
  const alasanInput = document.getElementById("alasan");
  if (select.value === "Tidak Setuju") {
    alasanDiv.style.display = "block";
    alasanInput.required = true;
  } else {
    alasanDiv.style.display = "none";
    alasanInput.required = false;
  }
}

function validateTelefon(input) {
  const errorEl = document.getElementById("telefonError");
  const valid = /^0\d{8,14}$/.test(input.value); // 9-15 digit termasuk 0 depan

  if (!valid && input.value !== "") {
    errorEl.style.display = "block";
  } else {
    errorEl.style.display = "none";
  }
}

window.onload = () => {
  fetch(scriptURL + '?action=getOptions')
    .then((res) => res.json())
    .then((data) => {
      const unitSelect = document.getElementById("unit");
      const jalanSelect = document.getElementById("jalan");

      data.units.forEach((u) => {
        const option = document.createElement("option");
        option.value = u;
        option.textContent = u;
        unitSelect.appendChild(option);
      });

      data.jalans.forEach((j) => {
        const option = document.createElement("option");
        option.value = j;
        option.textContent = j;
        jalanSelect.appendChild(option);
      });
    })
    .catch(() => {
      alert("Gagal muatkan data dropdown. Sila cuba lagi.");
    });
};
