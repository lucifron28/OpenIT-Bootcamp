const url = 'http://localhost:5001/api';

// get all programs
const getPrograms = async () => {
    try {
        const response = await fetch(`${url}/programs`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching programs:', error);
    }
}

(async () => {
    const programs = await getPrograms();
    console.log(programs);
})();