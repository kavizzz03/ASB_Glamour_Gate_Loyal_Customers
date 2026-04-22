export const validateNIC = (nic) => {
  return /^[0-9]{9}[vVxX]$/.test(nic) || /^[0-9]{12}$/.test(nic);
};

export const extractNICDetails = (nic) => {
  let year, days;

  if (nic.length === 10) {
    year = "19" + nic.substring(0, 2);
    days = parseInt(nic.substring(2, 5));
  } else {
    year = nic.substring(0, 4);
    days = parseInt(nic.substring(4, 7));
  }

  let gender = days > 500 ? "Female" : "Male";
  if (days > 500) days -= 500;

  const dob = new Date(year, 0);
  dob.setDate(days);

  return {
    gender,
    dob: dob.toISOString().split("T")[0],
  };
};