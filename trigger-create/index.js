const { CloudBuildClient } = require('@google-cloud/cloudbuild');
const cb = new CloudBuildClient();

exports.manageTriggers = async (req, res) => {
  // Setup CORS so your browser can talk to the function
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).send('');

  const projectId = process.env.GCP_PROJECT;

  try {
    if (req.method === 'GET') {
      // 1. Fetch all triggers in the project
      const [triggers] = await cb.listBuildTriggers({ projectId });
      return res.status(200).json(triggers.map(t => ({ name: t.name, id: t.id })));
    }

    if (req.method === 'POST') {
      // 2. Run the selected trigger
      const { triggerId } = req.body;
      const [operation] = await cb.runBuildTrigger({
        projectId,
        triggerId,
        source: { branchName: 'main' } // Customize as needed
      });
      return res.status(200).send(`Build Started: ${operation.name}`);
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
