import * as sb from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const communityButton = document.getElementById('communityButton')
const apiURL = window.env.APIURL
const apiKey = window.env.APIKEY

const supa = sb.createClient(apiURL, apiKey)
communityButton.addEventListener('click', uploadData())
async function uploadData() {
    const email = 'test@gmail.com'
    const name = 'test'

    const { data, error } = await supa
        .from('communityMembers').insert([{
            Name: name,
            Email: email,
         }])

    if (error) {
        return error
    } else {
        return data
    }
}

async function fetchId(id) {
    const { data, error } = await supa
        .from('communityForm')
        .select("*")
        .eq('id', id);
    
    if (error) {
        return false;
    } else {
        return true;
    }

}