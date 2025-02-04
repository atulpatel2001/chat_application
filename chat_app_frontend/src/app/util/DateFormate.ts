export const stringToChatDisplayFormate=(dateString:string)=>{
    const date = new Date(dateString);

const hours = date.getHours();
const minutes = date.getMinutes();

// Format the time as "hh:mm AM/PM"
const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
}).format(date);

return formattedTime;
}