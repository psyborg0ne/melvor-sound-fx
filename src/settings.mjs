
// Initializes settings for the mod - adds all non-combat skills, split between categories
export function initSettings()
{
    const ctx = mod.getContext(import.meta);

    const settingsGeneral = ctx.settings.section("General");

    const settingsGathering = ctx.settings.section("Gathering");
    const settingsCrafting = ctx.settings.section("Crafting");
    const settingsArtisan = ctx.settings.section("Artisan");

    const settingsArrayGathering = [];
    const settingsArrayCrafting = [];
    const settingsArrayArtisan = [];

    // Master volume
    settingsGeneral.add({
      type: 'number',
      min: 0,
      max: 100,
      label: 'Master Volume %',
      hint: 'Sets the master volume for all sounds | 0 to mute',
      default: 10,
      name: 'MasterVolume'
    })

    // Iterate skills and add to settings
    game.skills.forEach((skill) => {
      let skillType = Object.getPrototypeOf(Object.getPrototypeOf(skill)).constructor.name;
      let skillname = getLangString(`SKILL_NAME_${skill.localID}`);
      let skillicon = assets.getURI(`assets/media/skills/${skillname}/${skillname}.png`);
      let skillSetting = {};

      // Create skill html element
      let elementhost = document.createElement('div');
      let settingHTML = SettingLabel({skillname: skillname, skillicon: skillicon});
      let settingsDesc = ui.create(settingHTML, elementhost);

      // Populate settings object
      skillSetting = {
        type: 'switch',
        label: settingsDesc,
        hint: `Enable ${skillname} sounds`,
        default: true,
        name: skillname
      }

      // Assign settings to arrays based on skill type
      if (skillType === "GatheringSkill")
      {
        settingsArrayGathering.push(skillSetting);
      }
      else if (skillType === "CraftingSkill")
        {
          settingsArrayCrafting.push(skillSetting);
        }
      else if (skillType === "ArtisanSkill")
      {
        settingsArrayArtisan.push(skillSetting);
      }
    })

    // Add settings to sections
    settingsGathering.add(settingsArrayGathering);
    settingsCrafting.add(settingsArrayCrafting);
    settingsArtisan.add(settingsArrayArtisan);
}

function SettingLabel(props)
{
  return {
    $template: '#psy-sfx-settings-label',
    skillname: props.skillname,
    skillicon: props.skillicon
  }
}