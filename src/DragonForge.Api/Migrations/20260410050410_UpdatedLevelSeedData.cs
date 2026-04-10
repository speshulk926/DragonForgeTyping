using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DragonForge.Api.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedLevelSeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 3,
                column: "PromptTexts",
                value: "[\"ask all fall lads flask salad\",\"dad jak lad ask sad fall\",\"falls asks salads flasks lads\",\"a sad lad asks dad for salad\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 5,
                column: "PromptTexts",
                value: "[\"we wet rew tree were quest\",\"tree wet rew west were qwert\",\"we were free tree wet quest\",\"the tree grew wet where we rest\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 10,
                column: "PromptTexts",
                value: "[\"man men mine moon nom\",\"moon name mine noon moan man\",\"the man ran nine more moon men\",\"no man can name the moon in a mine\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 11,
                column: "PromptTexts",
                value: "[\"machine verb combine zone mix ban\",\"the brave zombie came back from camp\",\"a boxing van drove next to the cabin\",\"combine zinc and mix the vitamin batch\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 12,
                column: "PromptTexts",
                value: "[\"the quick brown fox jumps over a lazy dog\",\"pack my box with five dozen liquor jugs\",\"crazy viking joked with bad flux tempo\",\"how quickly jumping zebras vex fond dogs\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 13,
                column: "PromptTexts",
                value: "[\"The dog sat down and ate his food.\",\"Jack went up the hill to get water.\",\"Sam ran fast but Zoe was even faster.\",\"My friend Alex lives near the big park.\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 14,
                column: "PromptTexts",
                value: "[\"12345 67890 13579 24680\",\"I have 3 cats and 2 dogs at home.\",\"Room 42 has 7 desks and 10 chairs.\",\"She scored 95 out of 100 on test 4.\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Description", "PromptTexts" },
                values: new object[] { "Practice common punctuation in real sentences", "[\"Hello, how are you? I\\u0027m doing fine!\",\"Wait, what? No way! That\\u0027s so cool.\",\"She said, \\u0022Let\\u0027s go to the park today.\\u0022\",\"Can you help me? Yes, I\\u0027d love to!\"]" });

            migrationBuilder.InsertData(
                table: "LevelDefinitions",
                columns: new[] { "Id", "BasePoints", "Description", "LevelNumber", "MinWpmForBonus", "Phase", "PromptTexts", "Title" },
                values: new object[,]
                {
                    { 16, 25, "Short and sweet two-letter words", 16, null, "Hatchling", "[\"to is an it on at in or we do\",\"he me be us no so up if my am\",\"go by of as ox is to an it we\",\"do me no he up at in on so am\"]", "Two-Letter Words" },
                    { 17, 25, "Common three-letter words", 17, null, "Hatchling", "[\"the and for cat dog run big hat\",\"red hot cup map set fox bat sun\",\"top hit fun bed log pen web van\",\"sit mix hop dig rub cut zip yam\"]", "Three-Letter Words" },
                    { 18, 35, "Building up to four-letter words", 18, null, "Hatchling", "[\"jump fire bold lake home star book\",\"game fish land dark moon tree bird\",\"rain snow wind hill path road rock\",\"king gold cave song bell drum flag\"]", "Four-Letter Words" },
                    { 19, 35, "Longer words that build fluency", 19, null, "Hatchling", "[\"brave flame sword quest storm light\",\"magic river tower stone water dream\",\"power cloud shine scale guard heart\",\"blaze torch forge ember lucky world\"]", "Five-Letter Words" },
                    { 20, 25, "A mix of two to four-letter words", 20, null, "Hatchling", "[\"the big red fox ran to his den\",\"a cat sat on top of my old hat\",\"go fly up and see the hot sun\",\"one day she won a new pet dog\"]", "Mixed Short Words" },
                    { 21, 35, "A mix of four to six-letter words", 21, null, "Hatchling", "[\"dragon flame castle knight bridge tower\",\"forest meadow stream garden shield armor\",\"battle wizard scroll potion bottle hammer\",\"dungeon portal secret hidden golden silver\"]", "Mixed Medium Words" },
                    { 22, 25, "Words you see all the time in reading", 22, null, "Hatchling", "[\"about their would could people other\",\"should every after where before little\",\"because again different another through right\",\"between never under still always found\"]", "Common Sight Words" },
                    { 23, 25, "Simple two-word pairs to build flow", 23, null, "Hatchling", "[\"big cat red dog old map hot sun\",\"my home one day new game go fast\",\"blue sky dark cave long road top hill\",\"fire ball ice cold gold ring red star\"]", "Two-Word Combos" },
                    { 24, 25, "Short phrases to build rhythm", 24, null, "Hatchling", "[\"run very fast eat some food find the gold\",\"see the moon pet the cat fly a kite\",\"ride the wave read a book make some art\",\"find the key open the door start the fire\"]", "Three-Word Phrases" },
                    { 25, 35, "Slightly longer phrases for building speed", 25, null, "Hatchling", "[\"the dragon flew high over the dark forest\",\"a brave knight stood ready for the fight\",\"the egg began to glow with warm light\",\"a tiny flame burned inside the old cave\"]", "Four-Word Phrases" },
                    { 26, 50, "Simple sentences without punctuation", 26, null, "Hatchling", "[\"the small dragon ran across the green field\",\"a warm wind blew through the open window\",\"the old wizard found a glowing blue stone\",\"five birds flew over the tall castle wall\"]", "Short Sentences" },
                    { 27, 50, "Short sentences with proper capitalization", 27, null, "Hatchling", "[\"The little dragon ate three fish for lunch.\",\"Anna found a shiny coin under the bridge.\",\"My best friend Max has a pet lizard.\",\"Every morning the sun rises over the hill.\"]", "Sentences with Capitals" },
                    { 28, 50, "Sentences ending with periods", 28, null, "Hatchling", "[\"The cave was dark. A torch lit the way.\",\"Rain fell all day. The river rose fast.\",\"The knight drew his sword. He was ready.\",\"Stars filled the sky. The moon was full.\"]", "Sentences with Periods" },
                    { 29, 50, "Sentences with commas, periods, and questions", 29, null, "Hatchling", "[\"The dragon roared, and the ground shook hard.\",\"Where did the wizard go? Nobody knows for sure.\",\"Run, jump, and fly! The race has begun.\",\"After the rain stopped, a rainbow filled the sky.\"]", "Mixed Punctuation" },
                    { 30, 75, "Longer sentences to test your speed", 30, null, "Hatchling", "[\"The brave dragon flew over the mountains and landed near a quiet lake.\",\"A young wizard opened an old book and found a map to hidden treasure.\",\"The knight rode through the forest until he reached the stone castle.\",\"Every night the stars told stories about the dragons of long ago.\"]", "Medium Sentences" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 18);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 22);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 23);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 24);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 25);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 26);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 27);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 28);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 29);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 30);

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 3,
                column: "PromptTexts",
                value: "[\"ask all fall lads flask salad\",\"dad jak lad ask sad fall\",\"fallsasks salads flasks lads\",\"a sad lad asks dad for salad\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 5,
                column: "PromptTexts",
                value: "[\"we wetrew tree were quest\",\"tree wetrew west were qwert\",\"we were free tree wet quest\",\"the tree grew wet where we rest\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 10,
                column: "PromptTexts",
                value: "[\"man men mine moon nom mn\",\"moon name mine noon moan man\",\"name, moon. man, mine. noon, moan.\",\"the man and moon met at noon, no name.\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 11,
                column: "PromptTexts",
                value: "[\"combine, vex. ban, mix. zone, comb.\",\"machine verb combine zone mix ban\",\"the brave zombie came back, no venom.\",\"combine zinc and nix, mix boxen, ban.\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 12,
                column: "PromptTexts",
                value: "[\"the quick brown fox jumps over a lazy dog\",\"pack my box with five dozen liquor jugs\",\"crazy viking joked with bad fluxempo\",\"how quickly jumping zebras vex fond dogs\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 13,
                column: "PromptTexts",
                value: "[\"The Dog Sat Down And Ate His Food\",\"Jack And Jill Went Up The Hill Fast\",\"Sam Ran Quick But Zoe Was Even Faster\",\"My Friend Alex Lives Near Big Park Zoo\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 14,
                column: "PromptTexts",
                value: "[\"12345 67890 13579 24680\",\"I have 3 cats and 2 dogs at home\",\"Room 42 has 7 desks and 10 chairs\",\"She scored 95 out of 100 on test 4\"]");

            migrationBuilder.UpdateData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Description", "PromptTexts" },
                values: new object[] { "Practice common punctuation: . , ! ? ' \"", "[\"Hello, world! How are you? I\\u0027m fine.\",\"\\u0022Wow!\\u0022 she said. \\u0022That\\u0027s amazing, right?\\u0022\",\"Wait, what? No way! That\\u0027s so cool.\",\"He asked, \\u0022Can you help?\\u0022 I said, \\u0022Yes!\\u0022\"]" });
        }
    }
}
