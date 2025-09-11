/**
 * Utility function to format phone numbers for display
 * @param phoneNumber - The phone number as a number
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (phoneNumber: number): string => {
  const phoneStr = phoneNumber.toString();

  // Handle different phone number lengths
  if (phoneStr.length === 10) {
    // Format as (XXX) XXX-XXXX
    return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(
      6
    )}`;
  } else if (phoneStr.length === 11 && phoneStr.startsWith("1")) {
    // Format as 1 (XXX) XXX-XXXX
    return `1 (${phoneStr.slice(1, 4)}) ${phoneStr.slice(
      4,
      7
    )}-${phoneStr.slice(7)}`;
  } else {
    // Fallback for other formats
    return phoneStr;
  }
};
