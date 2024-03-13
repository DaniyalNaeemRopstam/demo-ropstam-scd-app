export const excludeUnUsedkeysFromUserObj = (userObj: any) => {
  const {
    ageRange,
    dateOfBirth,
    description,
    education,
    firstName,
    gender,
    habits,
    interests,
    job,
    lastName,
    location,
    preferences,
    radius,
    seeking,
    userName,
    iceBreakers,
    images,
    isViewMessageLog,
    themeMode,
  } = userObj;

  const restData = {
    ageRange,
    dateOfBirth,
    description,
    education,
    firstName,
    gender,
    habits,
    interests,
    job,
    lastName,
    location,
    preferences,
    radius,
    seeking,
    userName,
    iceBreakers,
    images,
    isViewMessageLog,
    themeMode,
  };

  return restData;
};
