export async function setup({loadModule, onModsLoaded, patch, getResourceUrl, onInterfaceReady}){
  // Load and initialize settings
  const opt = await loadModule('src/settings.mjs');
  const sfx = await loadModule('src/sfx.mjs');

  onInterfaceReady(() => {
    // Initialize settings
    try{
      opt.initSettings();
    }
    catch (e) {
      console.log('Error initializing settings:', e);
    }

    game.skills.forEach((skill) => {
      let skillname = getLangString(`SKILL_NAME_${skill.localID}`);
      let skilltype = Object.getPrototypeOf(Object.getPrototypeOf(skill)).constructor.name;

      let sXpDrop;
      let sLevel;
      let sLevelAbyss;

      let xpPatch;
      let levelPatch;
      let levelAbyssPatch;

      // Retrieve skill sounds
      try{
        sXpDrop = getResourceUrl(`sfx/${skillname}_xpdrop.wav`);
        sLevel = getResourceUrl(`sfx/${skillname}_lvl.ogg`);
        sLevelAbyss = getResourceUrl(`sfx/${skillname}_lvlabyss.ogg`);
      }
      catch (e) {
        console.log(`Error loading sound files for [${skillname}]`);
      }

      // Create the necessary patches
      try
      {
        xpPatch = patch(skill.constructor, 'addXP');
        levelPatch = patch(skill.constructor, 'levelUp');
        levelAbyssPatch = patch(skill.constructor, 'abyssalLevelUp');
      }
      catch (e) {
        console.log(`Error creating patch for [${skill.constructor.name}] methods`);
      }

      // Patch methods with sounds
      try
      {
        xpPatch.after(() => {sfx.playSound(sXpDrop, skillname, skilltype)});
        console.log(`[PSY] | ${skillname} | Patched addXP method with sound: ${sXpDrop}`);
        levelPatch.after(() => {sfx.playSound(sLevel, skillname, skilltype)});
        console.log(`[PSY] | ${skillname} | Patched levelUp method with sound: ${sLevel}`);
        levelAbyssPatch.after(() => {sfx.playSound(sLevelAbyss, skillname, skilltype)});
        console.log(`[PSY] | ${skillname} | Patched abyssalLevelUp method with sound: ${sLevel}`);
      }
      catch (e) {
        console.log(`Error patching skill [${skillname}] \n`, e);
      }
    })

  })
}