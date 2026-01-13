import 'dotenv/config';
import { claudeService } from './services/claude.service';

async function testDevelopmentalEditing() {
  const sampleChapter = `Chapter 1: The Call

Alaric Stormwind stood atop the windswept tower, gazing across the frozen wasteland that had once been the kingdom of Eloria. Three years had passed since the Shadow War, and still the scars remained—jagged crevasses splitting the earth, skeletal trees clawing at an ashen sky, and the ever-present silence where birdsong should have been.

"You can't keep running forever," a voice called from below.

He turned to see Brenna climbing the last few steps, her breath forming clouds in the frigid air. She'd been his friend since childhood, and the only one who understood why he'd exiled himself to this desolate outpost.

"I'm not running," Alaric replied, his voice as cold as the wind. "I'm waiting."

"For what?" Brenna stepped onto the platform, pulling her cloak tighter.

He held up the letter that had arrived that morning. Even from a distance, the seal of the High Council was unmistakable—a silver phoenix rising from flames.

"They're calling me back. They need me to find the Soulblade." His jaw tightened. "The weapon that started this whole mess."

Brenna's eyes widened. "The Soulblade is a myth. A legend to scare children."

"That's what I thought too." Alaric unfolded the letter, scanning the elegant script once more. "But according to this, it's real. And it's the only thing that can seal the rift before the Shadow Realm consumes what's left of our world."

The wind howled, as if in answer. Somewhere far below, ice cracked like breaking bones.

"You don't have to do this alone," Brenna said quietly. "I'm coming with you."

Alaric wanted to argue, to tell her it was too dangerous, that he'd already lost too many people. But when he met her eyes—those fierce, determined eyes that had pulled him back from the edge more times than he could count—he knew there was no point.

"Pack light," he said. "We leave at dawn."`;

  console.log('🧪 Testing Claude API Integration\n');
  console.log('=' .repeat(60));
  console.log('Sample Chapter: Epic Fantasy, ~350 words\n');

  try {
    console.log('📤 Sending chapter to Claude for developmental analysis...\n');

    const { feedback, usage } = await claudeService.analyzeDevelopmental(
      sampleChapter,
      {
        genre: 'Epic Fantasy',
        bookNumber: 1,
        totalBooks: 10,
        chapterNumber: 1,
      }
    );

    console.log('=' .repeat(60));
    console.log('✅ SUCCESS - Developmental Feedback Received!\n');

    console.log(`📊 Overall Score: ${feedback.overallScore}/10\n`);

    console.log('💪 Strengths:');
    feedback.strengths.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s}`);
    });

    console.log('\n⚠️  Weaknesses:');
    feedback.weaknesses.forEach((w, i) => {
      console.log(`   ${i + 1}. ${w}`);
    });

    console.log('\n📝 Detailed Feedback (first 500 chars):');
    console.log('   ' + feedback.feedback.substring(0, 500).replace(/\n/g, '\n   ') + '...\n');

    console.log(`🎯 Inline Highlights: ${feedback.inlineHighlights.length}`);
    if (feedback.inlineHighlights.length > 0) {
      console.log('\n   Example highlight:');
      const highlight = feedback.inlineHighlights[0];
      console.log(`   - Type: ${highlight.type}`);
      console.log(`   - Position: ${highlight.start}-${highlight.end}`);
      console.log(`   - Comment: ${highlight.comment}`);
    }

    console.log('\n💰 API Usage:');
    console.log(`   Input tokens:  ${usage.inputTokens.toLocaleString()}`);
    console.log(`   Output tokens: ${usage.outputTokens.toLocaleString()}`);
    console.log(`   Total tokens:  ${usage.totalTokens.toLocaleString()}`);
    console.log(`   Cost:          $${usage.costUsd.toFixed(4)}`);

    console.log('\n' + '=' .repeat(60));
    console.log('✅ Test Passed! Claude integration is working correctly.\n');

  } catch (error) {
    console.error('\n❌ TEST FAILED\n');
    console.error('Error:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Check that ANTHROPIC_API_KEY is set in backend/.env');
    console.error('2. Verify your API key is valid at https://console.anthropic.com/');
    console.error('3. Ensure you have billing set up and credits available');
    process.exit(1);
  }
}

async function testSummaryGeneration() {
  const sampleChapter = `Chapter 2: Into the Ruins

The journey to the Ancient Ruins took three days through treacherous mountain passes. Alaric and Brenna traveled in silence for most of it, each lost in their own thoughts.

When they finally reached the crumbling stone archway that marked the entrance, the sun was setting, casting long shadows across the rubble-strewn courtyard.

"This place gives me the creeps," Brenna muttered, hand on her sword hilt.

Alaric consulted the map the Council had provided. "The vault should be in the lower chambers. We'll camp here tonight and descend at first light."

But that night, as they huddled around a small fire, Alaric heard something—a whisper on the wind, speaking his name. When he investigated, he found ancient runes carved into the stone walls, glowing faintly with an otherworldly blue light.

The runes told a story: of a warrior who had wielded the Soulblade against the Shadow King, of a terrible price paid for victory, and of a curse that bound the blade to the bloodline of its wielder.

Alaric's bloodline.

"We need to leave," he said, returning to camp. "Now."

But it was too late. The ground beneath them trembled, and from the depths of the ruins, something ancient and hungry began to stir.`;

  console.log('\n\n🧪 Testing Summary Generation (Claude Haiku)\n');
  console.log('=' .repeat(60));

  try {
    console.log('📤 Generating chapter summary...\n');

    const { summary, usage } = await claudeService.generateSummary(
      sampleChapter,
      2,
      'Epic Fantasy'
    );

    console.log('✅ SUCCESS - Summary Generated!\n');

    console.log('📋 Summary (first 300 chars):');
    console.log('   ' + summary.summary.substring(0, 300).replace(/\n/g, '\n   ') + '...\n');

    console.log(`🔑 Key Points: ${summary.keyPoints.length}`);
    summary.keyPoints.forEach((point, i) => {
      console.log(`   ${i + 1}. ${point}`);
    });

    console.log('\n👥 Entities Found:');
    console.log(`   Characters: ${summary.entities.characters.join(', ') || 'None'}`);
    console.log(`   Places:     ${summary.entities.places.join(', ') || 'None'}`);
    console.log(`   Events:     ${summary.entities.events.join(', ') || 'None'}`);

    console.log('\n💰 API Usage (Haiku - 10x cheaper):');
    console.log(`   Total tokens: ${usage.totalTokens.toLocaleString()}`);
    console.log(`   Cost:         $${usage.costUsd.toFixed(4)}`);

    console.log('\n' + '=' .repeat(60));
    console.log('✅ Summary test passed!\n');

  } catch (error) {
    console.error('\n❌ Summary test failed:', error);
  }
}

// Run tests
async function runAllTests() {
  try {
    await testDevelopmentalEditing();
    await testSummaryGeneration();

    console.log('\n🎉 All tests passed! Claude service is ready for integration.\n');
    console.log('Next steps:');
    console.log('  1. Create chapter upload route');
    console.log('  2. Build frontend upload UI');
    console.log('  3. Test end-to-end workflow\n');

  } catch (error) {
    console.error('\n💥 Tests failed:', error);
    process.exit(1);
  }
}

runAllTests();
