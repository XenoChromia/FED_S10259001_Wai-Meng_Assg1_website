import * as sb from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const communityButton = document.getElementById('communityButton')
const apiURL ="https://vladaopkzpgutrrgqnmy.supabase.co"
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsYWRhb3BrenBndXRycmdxbm15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2NTc5MzYsImV4cCI6MjA0NzIzMzkzNn0.TbTBfwwpNPpmMXLtL6KAGLx4pf0OMS-z32D4HRJ9HHc"

const supa = sb.createClient(apiURL, apiKey)
communityButton.addEventListener('click', uploadData)
async function uploadData() {
    const email = document.getElementById('email').value

    const { data, error } = await supa
        .from('community').insert([{ email:email }]);
    
}