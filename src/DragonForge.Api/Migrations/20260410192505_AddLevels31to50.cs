using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DragonForge.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddLevels31to50 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "LevelDefinitions",
                columns: new[] { "Id", "BasePoints", "Description", "LevelNumber", "MinWpmForBonus", "Phase", "PromptTexts", "Title" },
                values: new object[,]
                {
                    { 31, 75, "Full sentences with all keys", 31, null, "Drake", "[\"Jimothy packed his bag and set off down the winding forest path at dawn.\",\"The little dragon tried to keep up, tripping over roots and stones.\",\"Smoke curled from the dragon\\u0027s nose every time it sneezed in the cold air.\",\"They crossed a bridge made of old rope that swayed above a rushing river.\"]", "Longer Sentences I" },
                    { 32, 75, "Building speed with longer text", 32, null, "Drake", "[\"The forest grew darker as they walked deeper into the ancient woods.\",\"Strange mushrooms glowed with a faint blue light along the narrow trail.\",\"Jimothy held a torch in one hand and kept the dragon close with the other.\",\"Somewhere in the distance, an owl hooted and the dragon hid behind a rock.\"]", "Longer Sentences II" },
                    { 33, 75, "Typing with flow and rhythm", 33, null, "Drake", "[\"By noon they found a clearing with a stream and stopped to rest and eat.\",\"The dragon caught a fish by accident when it fell into the shallow water.\",\"Jimothy laughed so hard that he dropped his sandwich into the mud below.\",\"After lunch they dried off in the sun and continued on their long journey.\"]", "Longer Sentences III" },
                    { 34, 75, "Sentences with question marks and dialogue", 34, null, "Drake", "[\"\\u0022Where are we going?\\u0022 the dragon seemed to ask with its big round eyes.\",\"Jimothy looked at the map and said, \\u0022We should reach the village by sunset.\\u0022\",\"\\u0022Do you think they will be afraid of you?\\u0022 he asked the little dragon.\",\"The dragon tilted its head as if to say, \\u0022Who could be scared of me?\\u0022\"]", "Questions and Answers" },
                    { 35, 75, "Stories about the world of dragons", 35, null, "Drake", "[\"Long ago, dragons filled the skies and their roars echoed across every land.\",\"They came in every color, from deep ocean blue to bright sunrise gold.\",\"The fire dragons lived near volcanoes and could melt stone with a single breath.\",\"Ice dragons preferred the frozen north where snowflakes danced around their wings.\"]", "Dragon Lore I" },
                    { 36, 75, "The history of dragon riders", 36, null, "Drake", "[\"In the old days, brave heroes would earn a dragon\\u0027s trust through acts of kindness.\",\"A dragon never forgets someone who helped it, even if many years have passed.\",\"The bond between a rider and dragon was said to be stronger than steel.\",\"Together they could fly faster than the wind and see beyond the horizon.\"]", "Dragon Lore II" },
                    { 37, 75, "Sentences with numbers mixed in naturally", 37, null, "Drake", "[\"The castle had 7 towers, each one taller than the last, reaching 200 feet high.\",\"Jimothy counted 14 stars in the sky before the clouds rolled in at midnight.\",\"The dragon ate 3 fish, 2 apples, and about 50 berries for its evening meal.\",\"It took them 5 days to cross the mountain pass and reach the valley below.\"]", "Numbers in Context" },
                    { 38, 75, "Fast-paced adventure sentences", 38, null, "Drake", "[\"The ground shook! A massive boulder rolled down the hill straight toward them!\",\"Jimothy grabbed the dragon and dove behind a fallen tree just in time.\",\"The boulder crashed past, taking out three trees and splashing into the lake.\",\"They looked at each other, breathing hard, and then burst out laughing.\"]", "Exciting Action" },
                    { 39, 75, "Detailed descriptive sentences", 39, null, "Drake", "[\"The village had small stone houses with red roofs and gardens full of flowers.\",\"A warm golden light spilled from every window into the cool evening air.\",\"The smell of fresh bread and roasting meat drifted down the cobblestone street.\",\"Children played near the fountain while their parents chatted on wooden benches.\"]", "Descriptions" },
                    { 40, 75, "Longer sentences with commas and clauses", 40, null, "Drake", "[\"Although the path was steep and the rain made it slippery, they kept climbing.\",\"The dragon, who had grown a little bigger each day, could now glide short distances.\",\"Jimothy knew that if they could reach the top, the view would be worth every step.\",\"When they finally arrived, the sunset painted the whole sky in orange and purple.\"]", "Complex Sentences" },
                    { 41, 100, "Multiple sentences in a row", 41, null, "Drake", "[\"The dragon woke up early. It stretched its wings and yawned, sending a tiny puff of smoke into the morning air. Jimothy was still asleep by the campfire.\",\"A rabbit hopped past the campsite. The dragon watched it carefully, its tail twitching back and forth. Then it pounced and missed completely.\"]", "Short Paragraphs I" },
                    { 42, 100, "Building endurance with longer text", 42, null, "Drake", "[\"They reached the top of the hill and looked down at the valley below. A river wound through green fields like a silver ribbon. Tiny houses dotted the landscape.\",\"The dragon made a happy sound and flapped its wings. It wanted to fly down, but it was still too small. Jimothy scratched its head and said maybe next week.\"]", "Short Paragraphs II" },
                    { 43, 100, "Telling stories through typing", 43, null, "Drake", "[\"The old blacksmith looked at the dragon and smiled. He had not seen one in forty years. He told them that dragons used to visit his shop to have their scales polished.\",\"Jimothy asked if the blacksmith could make a small collar for the dragon. The old man nodded and got to work. By sunset, the dragon wore a tiny golden tag that read: Friend.\"]", "Short Paragraphs III" },
                    { 44, 100, "Legends of the ancient dragons", 44, null, "Drake", "[\"The Elder Dragons were the first creatures to walk the earth. They shaped mountains with their claws and filled oceans with their tears of joy. Every river began as a dragon\\u0027s gift.\",\"When an Elder Dragon passed away, a new star would appear in the night sky. The dragons believed that their ancestors watched over them from above, guiding them with gentle starlight.\"]", "Dragon Lore III" },
                    { 45, 100, "Jimothy and the dragon press on", 45, null, "Drake", "[\"The map showed a shortcut through the Whispering Caves. Jimothy was nervous, but the dragon marched right in. Its scales began to glow softly, lighting the way through the darkness.\",\"Strange crystals hung from the ceiling like frozen raindrops. The dragon touched one with its nose and it chimed like a tiny bell. Soon the whole cave was singing.\"]", "Adventures Continue" },
                    { 46, 100, "Descriptive paragraphs about nature", 46, null, "Drake", "[\"Autumn had arrived and the leaves were turning brilliant shades of red and gold. The air was crisp and cool, perfect for hiking. The dragon loved crunching through the fallen leaves.\",\"Winter brought snow to the mountains. Jimothy built a shelter while the dragon tried to breathe fire for the first time. All it managed was a warm puff, but it was enough to melt some snow for water.\"]", "Weather and Seasons" },
                    { 47, 100, "Dialogue-heavy paragraphs", 47, null, "Drake", "[\"A girl named Elara spotted them from her farm. \\u0022Is that a real dragon?\\u0022 she gasped. Jimothy nodded. \\u0022Don\\u0027t worry, it\\u0027s friendly.\\u0022 The dragon proved it by gently nuzzling her hand.\",\"Elara invited them inside for soup. While they ate, she told them about the old dragon tower north of the village. \\u0022Nobody goes there anymore,\\u0022 she said, \\u0022but I hear it glows at night.\\u0022\"]", "Meeting New Friends" },
                    { 48, 100, "An exciting discovery", 48, null, "Drake", "[\"The tower stood alone on a rocky hill, covered in vines and moss. As they got closer, the dragon became excited, pulling on Jimothy\\u0027s sleeve. Something about this place felt familiar to it.\",\"Inside, the walls were carved with images of dragons in flight. A spiral staircase led up into the darkness. The dragon began to climb, and Jimothy followed, his torch casting long shadows.\"]", "The Dragon Tower" },
                    { 49, 100, "Discovering dragon history", 49, null, "Beyond", "[\"At the top of the tower, they found a room filled with dragon eggs, all dark and cold. The dragon touched them gently, but none responded. These eggs had been sleeping for a very long time.\",\"A stone tablet on the wall told the story of the last dragons. They had hidden their eggs here to keep them safe, hoping that one day someone kind would find them and bring them home.\"]", "Ancient Secrets" },
                    { 50, 100, "The final stretch of the adventure", 50, null, "Beyond", "[\"Jimothy carefully packed the sleeping eggs into his bag. The dragon watched proudly, knowing that its family might one day wake up too. Together, they began the long walk home.\",\"As they walked, the dragon flew alongside Jimothy for the first time, strong enough at last to stay in the air. The sun set behind them, painting the sky in every color imaginable.\"]", "The Journey Home" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 31);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 32);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 33);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 34);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 35);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 36);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 37);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 38);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 39);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 40);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 41);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 42);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 43);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 44);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 45);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 46);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 47);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 48);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 49);

            migrationBuilder.DeleteData(
                table: "LevelDefinitions",
                keyColumn: "Id",
                keyValue: 50);
        }
    }
}
