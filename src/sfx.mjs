// Helper method to play sound
export function playSound(url, skillname, skilltype) {
    const ctx = mod.getContext(import.meta);
    const mVol = ctx.settings.section("General").get("MasterVolume");

    let skillCategory;
    let skillEnabled;

    // TODO: Fix unlisted skills
    if(skillname == 'Township' || skillname == 'Farming' || skillname == 'Cartography'){
        return;
    }

    switch (skilltype) {
        case 'GatheringSkill':
            skillCategory = ctx.settings.section("Gathering");
            break;
        case 'CraftingSkill':
            skillCategory = ctx.settings.section("Crafting");
            break;
        case 'ArtisanSkill':
            skillCategory = ctx.settings.section("Artisan");
            break;

        default:
            break;
    }

    skillEnabled = skillCategory.get(skillname);

    if (mVol > 0 && skillEnabled)
    {
        try{
            let audio = new Audio(url);
            audio.volume = mVol / 100;
            audio.play();
            console.log('Playing sound:', url);
          }
          catch (e) {
            console.log('Error playing sound:', e);
          }
    }
}