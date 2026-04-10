using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace DragonForge.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LevelDefinitions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    LevelNumber = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Phase = table.Column<string>(type: "text", nullable: false),
                    PromptTexts = table.Column<string>(type: "jsonb", nullable: false),
                    BasePoints = table.Column<int>(type: "integer", nullable: false),
                    MinWpmForBonus = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LevelDefinitions", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "LevelDefinitions",
                columns: new[] { "Id", "BasePoints", "Description", "LevelNumber", "MinWpmForBonus", "Phase", "PromptTexts", "Title" },
                values: new object[,]
                {
                    { 1, 10, "Practice the left home row keys: a s d f", 1, null, "Egg", "[\"ff dd ss aa fd sa df as\",\"sad fad dad add ads aff\",\"as sad dad fad dads adds\",\"fads dass sadf fdsa asdf\"]", "Home Row Left Hand" },
                    { 2, 10, "Practice the right home row keys: j k l ;", 2, null, "Egg", "[\"jj kk ll ;; jk lk jl kj\",\"jkl lkj kjl ljk ;lk j;l\",\"jk kl l; ;l lk kj j; ;j\",\"jkl; ;lkj kj;l l;kj jkl;\"]", "Home Row Right Hand" },
                    { 3, 10, "Combine left and right home row: a s d f j k l ;", 3, null, "Egg", "[\"ask all fall lads flask salad\",\"dad jak lad ask sad fall\",\"fallsasks salads flasks lads\",\"a sad lad asks dad for salad\"]", "Home Row Full" },
                    { 4, 10, "All home row keys including g and h", 4, null, "Egg", "[\"gash hash glad flag shag half\",\"flash flags gash halls shall glass\",\"had has gal lag hag jag sag dag\",\"a glad gal shall dash half a flag\"]", "Home Row Complete" },
                    { 5, 10, "Learn the top row left hand: q w e r t", 5, null, "Egg", "[\"we wetrew tree were quest\",\"tree wetrew west were qwert\",\"we were free tree wet quest\",\"the tree grew wet where we rest\"]", "Top Row Left" },
                    { 6, 10, "Learn the top row right hand: y u i o p", 6, null, "Egg", "[\"you your yip poi you yup\",\"pop pip you your yup poi\",\"you pour your iou yip poi\",\"you pour up yup pop poiopy\"]", "Top Row Right" },
                    { 7, 10, "Full top row: q w e r t y u i o p", 7, null, "Egg", "[\"typewriter your power quite wire poetry\",\"write your quote type power rope\",\"quiet poetry typewriter proper routine\",\"you write poetry with power quite proper\"]", "Top Row Full" },
                    { 8, 15, "Mix home row and top row keys together", 8, null, "Egg", "[\"the quick red fish just helped sort\",\"quest for gold right where they left\",\"quite right she sold the purple silk\",\"after the quiet hike up the top ridge\"]", "Home + Top Mixed" },
                    { 9, 10, "Learn the bottom row left hand: z x c v b", 9, null, "Egg", "[\"box cab vex czar vc bx zap\",\"excavate brace cave vex box cab\",\"brave cave cab box vex czar\",\"the brave cub excavated a cave by a box\"]", "Bottom Row Left" },
                    { 10, 10, "Learn the bottom row right hand: n m , . /", 10, null, "Egg", "[\"man men mine moon nom mn\",\"moon name mine noon moan man\",\"name, moon. man, mine. noon, moan.\",\"the man and moon met at noon, no name.\"]", "Bottom Row Right" },
                    { 11, 10, "Full bottom row: z x c v b n m , . /", 11, null, "Egg", "[\"combine, vex. ban, mix. zone, comb.\",\"machine verb combine zone mix ban\",\"the brave zombie came back, no venom.\",\"combine zinc and nix, mix boxen, ban.\"]", "Bottom Row Full" },
                    { 12, 15, "Random letters from all three rows", 12, null, "Egg", "[\"the quick brown fox jumps over a lazy dog\",\"pack my box with five dozen liquor jugs\",\"crazy viking joked with bad fluxempo\",\"how quickly jumping zebras vex fond dogs\"]", "All Rows Mixed" },
                    { 13, 15, "Introducing the shift key for capital letters", 13, null, "Egg", "[\"The Dog Sat Down And Ate His Food\",\"Jack And Jill Went Up The Hill Fast\",\"Sam Ran Quick But Zoe Was Even Faster\",\"My Friend Alex Lives Near Big Park Zoo\"]", "Capital Letters" },
                    { 14, 15, "Practice the number keys: 1 2 3 4 5 6 7 8 9 0", 14, null, "Egg", "[\"12345 67890 13579 24680\",\"I have 3 cats and 2 dogs at home\",\"Room 42 has 7 desks and 10 chairs\",\"She scored 95 out of 100 on test 4\"]", "Numbers Row" },
                    { 15, 15, "Practice common punctuation: . , ! ? ' \"", 15, null, "Egg", "[\"Hello, world! How are you? I\\u0027m fine.\",\"\\u0022Wow!\\u0022 she said. \\u0022That\\u0027s amazing, right?\\u0022\",\"Wait, what? No way! That\\u0027s so cool.\",\"He asked, \\u0022Can you help?\\u0022 I said, \\u0022Yes!\\u0022\"]", "Common Punctuation" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_LevelDefinitions_LevelNumber",
                table: "LevelDefinitions",
                column: "LevelNumber",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LevelDefinitions");
        }
    }
}
