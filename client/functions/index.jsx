import defaultAvatarUrl from "../public/connxprofile.png"; // Import the default avatar image directly

export const imageSource = (user) => {
  if (user && user.image && user.image.url) {
    return user.image.url;
  } else {
    return defaultAvatarUrl; // Use the imported default avatar image
  }
};
