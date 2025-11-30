export async function setup({ loadModule, patch, getResourceUrl, onInterfaceReady, api }) {
  // Load and initialize settings  
  const opt = await loadModule('src/settings.mjs');
  const sfx = await loadModule('src/sfx.mjs');

  // Make a map of modded skills and their sounds
  const moddedSkillSounds = new Map();

  api({
      /**
       * Function to add sounds to skills by other mods. To be called at onModsLoaded trigger and not after onInterfaceReady
       * @param {string} skillName - Translated skill name of the skill.
       * @param {object} sounds - { sXPDrop, sLevel, sLevelAbyss }, object containing the Urls of these sounds.   
      */
      registerSkillSounds: function (skillname, sounds) {
        moddedSkillSounds.set(skillname, sounds)
      }
  })

  onInterfaceReady(() => {
    // Initialize settings
    try {
      opt.initSettings();
    }
    catch (e) {
      console.log('Error initializing settings:', e);
    }
    game.skills.forEach((skill) => {
      let skillname = skill.name;
      let skilltype = Object.getPrototypeOf(Object.getPrototypeOf(skill)).constructor.name;

      let sXpDrop;
      let sLevel;
      let sLevelAbyss;

      let xpPatch;
      let levelPatch;
      let levelAbyssPatch;
      let sounds = moddedSkillSounds.get(skillname);
      // Retrieve skill sounds, checking for modded sounds first and using Url lookup if none are found.
      try {
        sXpDrop = sounds?.sXPDrop ?? getResourceUrl(`sfx/${skillname}_xpdrop.wav`);
        sLevel = sounds?.sLevel ?? getResourceUrl(`sfx/${skillname}_lvl.ogg`);
        sLevelAbyss = sounds?.sLevelAbyss ?? getResourceUrl(`sfx/${skillname}_lvlabyss.ogg`);
      }
      catch (e) {
        console.log(`Error loading sound files for [${skillname}]`);
      }

      // Create the necessary patches
      try {
        xpPatch = patch(skill.constructor, 'addXP');
        levelPatch = patch(skill.constructor, 'levelUp');
        levelAbyssPatch = patch(skill.constructor, 'abyssalLevelUp');
      }
      catch (e) {
        console.log(`Error creating patch for [${skill.constructor.name}] methods`);
      }

      // Patch methods with sounds
      try {
        xpPatch.after(() => { sfx.playSound(sXpDrop, skillname, skilltype) });
        console.log(`[PSY] | ${skillname} | Patched addXP method with sound: ${sXpDrop}`);
        levelPatch.after(() => { sfx.playSound(sLevel, skillname, skilltype) });
        console.log(`[PSY] | ${skillname} | Patched levelUp method with sound: ${sLevel}`);
        levelAbyssPatch.after(() => { sfx.playSound(sLevelAbyss, skillname, skilltype) });
        console.log(`[PSY] | ${skillname} | Patched abyssalLevelUp method with sound: ${sLevel}`);
      }
      catch (e) {
        console.log(`Error patching skill [${skillname}] \n`, e);
      }
    })

  })
}
