
const appendUtmParamters = (link: string, medium:string, content:string) => {
  let newLink = "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    utm_source: "linksfam",
    utm_medium: medium,
    utm_campaign: "cpc",
    utm_content: content
  };

  if (!link.includes("?")) {
    let linkString = "?";
    for (const item in params) {
      linkString += item + "=" + params[item] + "&";
    }
    newLink = linkString.substring(0, linkString.length - 1);
  } else {
    let linkString = "&";
    for (const item in params) {
      linkString += item + "=" + params[item] + "&";
    }
    newLink = linkString.substring(0, linkString.length - 1);
  }

  return link + newLink;
}

export default appendUtmParamters;


export const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = today.getFullYear();

  return `${day}${month}${year}`;
};

export const CAMPAIGNS = [
  { campaignId: 12144, name: 'nourishmantra' },
  { campaignId: 11977, name: 'trybloom' },
  { campaignId: 11921, name: 'nathabit' },
  { campaignId: 11875, name: 'nilkamalfurniture' },
  { campaignId: 11641, name: 'baccabucci' },
  { campaignId: 11501, name: 'levi' },
  { campaignId: 11496, name: 'koskii' },
  { campaignId: 11355, name: 'adidas' },
  { campaignId: 11287, name: 'pantaloons' },
  { campaignId: 11277, name: 'wildcraft' },
  { campaignId: 11241, name: 'salty' },
  { campaignId: 11092, name: 'reneecosmetics' },
  { campaignId: 11043, name: 'neemans' },
  { campaignId: 10994, name: 'foxtale' },
  { campaignId: 10971, name: 'beminimalist' },
  { campaignId: 10930, name: 'superbottoms' },
  { campaignId: 10900, name: 'bombayshavingcompany' },
  { campaignId: 10746, name: 'timexindia' },
  { campaignId: 10743, name: 'sonatawatches' },
  { campaignId: 10742, name: 'fastrack' },
  { campaignId: 10741, name: 'titan' },
  { campaignId: 10712, name: 'muftijeans' },
  { campaignId: 10666, name: 'mymuse' },
  { campaignId: 10645, name: 'healthmug' },
  { campaignId: 10364, name: 'ajio' },
  { campaignId: 10351, name: 'moglix' },
  { campaignId: 10320, name: 'gonoise' },
  { campaignId: 10258, name: 'uniqlo' },
  { campaignId: 10216, name: 'shopee' },
  { campaignId: 10215, name: 'shopee' },
  { campaignId: 10211, name: 'samsung' },
  { campaignId: 10203, name: 'purevpn' },
  { campaignId: 10194, name: 'pepperfry' },
  { campaignId: 10181, name: 'nordpass' },
  { campaignId: 10180, name: 'nordlocker' },
  { campaignId: 10169, name: 'muscleblaze' },
  { campaignId: 10132, name: 'klook' },
  { campaignId: 10126, name: 'kapiva' },
  { campaignId: 10111, name: 'hkvitals' },
  { campaignId: 10109, name: 'healthkart' },
  { campaignId: 10097, name: 'giva' },
  { campaignId: 10088, name: 'foreo' },
  { campaignId: 10081, name: 'firstcry' },
  { campaignId: 10046, name: 'cleartrip' }
];