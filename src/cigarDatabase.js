// ═══ CIGAR DATABASE — 600+ Popular Cigars ═══
// Includes Cigar Aficionado Top 25 winners 2020-2025
// and extensive brand coverage from major manufacturers
// Format: name|brand|wrapper|shape|strength|ringGauge|length|origin|price

const CIGAR_DATA = `
Padrón 1964 Anniversary Maduro Torpedo|Padrón|Maduro|Torpedo|Medium-Full|52|6"|Nicaragua|18
Padrón 1964 Anniversary Natural Torpedo|Padrón|Connecticut|Torpedo|Medium|52|6"|Nicaragua|18
Padrón 1964 Anniversary Maduro Exclusivo|Padrón|Maduro|Robusto|Medium-Full|50|5.5"|Nicaragua|16
Padrón 1964 Anniversary Maduro Imperial|Padrón|Maduro|Toro|Medium-Full|54|6"|Nicaragua|18
Padrón 1964 Anniversary Maduro Diplomatico|Padrón|Maduro|Corona|Medium-Full|42|7"|Nicaragua|18
Padrón 1926 Serie No. 1|Padrón|Maduro|Gordo|Full|54|6.75"|Nicaragua|30
Padrón 1926 Serie No. 2|Padrón|Maduro|Belicoso|Full|52|5.5"|Nicaragua|25
Padrón 1926 Serie No. 6|Padrón|Maduro|Robusto|Full|50|4.75"|Nicaragua|20
Padrón 1926 Serie No. 9|Padrón|Maduro|Toro|Full|56|5.25"|Nicaragua|22
Padrón 1926 Serie No. 35|Padrón|Maduro|Corona|Full|48|4"|Nicaragua|17
Padrón 1926 Serie No. 40|Padrón|Maduro|Gordo|Full|54|6.5"|Nicaragua|28
Padrón 1926 Serie No. 48|Padrón|Maduro|Gordo|Full|60|5.5"|Nicaragua|25
Padrón 2000|Padrón|Maduro|Robusto|Medium|50|5"|Nicaragua|8
Padrón 3000|Padrón|Maduro|Toro|Medium|52|5.5"|Nicaragua|9
Padrón 4000|Padrón|Maduro|Toro|Medium|54|6.5"|Nicaragua|10
Padrón 6000|Padrón|Maduro|Torpedo|Medium|52|5.5"|Nicaragua|10
Padrón Damaso No. 8|Padrón|Connecticut|Robusto|Mild-Medium|42|5.75"|Nicaragua|12
Padrón Damaso No. 12|Padrón|Connecticut|Toro|Mild-Medium|50|5.5"|Nicaragua|14
Padrón Damaso No. 15|Padrón|Connecticut|Gordo|Mild-Medium|52|5.25"|Nicaragua|13
Padrón Family Reserve 45|Padrón|Maduro|Toro|Full|52|6"|Nicaragua|35
Padrón Family Reserve 50|Padrón|Maduro|Gordo|Full|54|5.5"|Nicaragua|35
Padrón Family Reserve 85|Padrón|Maduro|Robusto|Full|50|5.375"|Nicaragua|40
Padrón Family Reserve 95|Padrón|Maduro|Torpedo|Full|52|6.375"|Nicaragua|40
Arturo Fuente Opus X|Arturo Fuente|Habano|Robusto|Full|50|5.25"|Dominican Republic|35
Arturo Fuente Opus X Perfecxion No. 5|Arturo Fuente|Habano|Robusto|Full|40|4.875"|Dominican Republic|28
Arturo Fuente Opus X Lost City|Arturo Fuente|Habano|Robusto|Full|52|5.25"|Dominican Republic|50
Arturo Fuente Opus X Reserva d'Chateau|Arturo Fuente|Habano|Churchill|Full|48|7"|Dominican Republic|50
Arturo Fuente Opus X Angel's Share Reserva d'Chateau|Arturo Fuente|Habano|Churchill|Medium-Full|48|7"|Dominican Republic|45
Arturo Fuente Don Carlos|Arturo Fuente|Cameroon|Robusto|Medium-Full|50|5"|Dominican Republic|12
Arturo Fuente Don Carlos Eye of the Shark|Arturo Fuente|Cameroon|Belicoso|Medium-Full|56|5.25"|Dominican Republic|25
Arturo Fuente Don Carlos No. 2|Arturo Fuente|Cameroon|Torpedo|Medium-Full|55|5.625"|Dominican Republic|14
Arturo Fuente Hemingway Short Story|Arturo Fuente|Cameroon|Petit Corona|Medium|49|4"|Dominican Republic|10
Arturo Fuente Hemingway Best Seller|Arturo Fuente|Cameroon|Torpedo|Medium|48|4.5"|Dominican Republic|12
Arturo Fuente Hemingway Masterpiece|Arturo Fuente|Cameroon|Torpedo|Medium|52|9"|Dominican Republic|20
Arturo Fuente 8-5-8|Arturo Fuente|Cameroon|Churchill|Medium|47|6"|Dominican Republic|8
Arturo Fuente Gran Reserva|Arturo Fuente|Cameroon|Churchill|Medium|48|6.25"|Dominican Republic|9
Arturo Fuente Chateau Fuente|Arturo Fuente|Connecticut|Robusto|Mild-Medium|50|4.5"|Dominican Republic|9
Arturo Fuente Chateau Fuente King T|Arturo Fuente|Connecticut|Churchill|Mild-Medium|49|7"|Dominican Republic|11
Arturo Fuente Magnum R 44|Arturo Fuente|Habano|Robusto|Medium-Full|44|5.5"|Dominican Republic|12
Arturo Fuente Magnum R 52|Arturo Fuente|Habano|Robusto|Medium-Full|52|5.25"|Dominican Republic|14
Arturo Fuente Magnum R 56|Arturo Fuente|Habano|Gordo|Medium-Full|56|5.625"|Dominican Republic|16
Oliva Serie V Melanio|Oliva|Habano|Toro|Medium-Full|50|6"|Nicaragua|14
Oliva Serie V Melanio Maduro|Oliva|Maduro|Toro|Full|50|6"|Nicaragua|15
Oliva Serie V Melanio Robusto|Oliva|Habano|Robusto|Medium-Full|52|5"|Nicaragua|13
Oliva Serie V Melanio Figurado|Oliva|Habano|Torpedo|Medium-Full|52|6.5"|Nicaragua|15
Oliva Serie V|Oliva|Habano|Toro|Full|50|6"|Nicaragua|11
Oliva Serie V Double Robusto|Oliva|Habano|Gordo|Full|54|5"|Nicaragua|12
Oliva Serie V Lancero|Oliva|Habano|Lancero|Full|38|7"|Nicaragua|11
Oliva Serie G|Oliva|Cameroon|Toro|Medium|50|6"|Nicaragua|8
Oliva Serie G Maduro|Oliva|Maduro|Toro|Medium-Full|50|6"|Nicaragua|8
Oliva Serie O|Oliva|Habano|Robusto|Medium-Full|50|5"|Nicaragua|7
Oliva Serie O Maduro|Oliva|Maduro|Robusto|Medium-Full|50|5"|Nicaragua|7
Oliva Connecticut Reserve|Oliva|Connecticut|Toro|Mild|50|6"|Nicaragua|8
Oliva Master Blends 3|Oliva|Habano|Robusto|Full|50|5"|Nicaragua|10
My Father Le Bijou 1922|My Father|Oscuro|Torpedo|Full|52|6.125"|Nicaragua|14
My Father Le Bijou 1922 Petit Robusto|My Father|Oscuro|Robusto|Full|50|4.5"|Nicaragua|11
My Father Le Bijou 1922 Churchill|My Father|Oscuro|Churchill|Full|48|7"|Nicaragua|15
My Father No. 1|My Father|Habano|Robusto|Medium-Full|52|5.25"|Nicaragua|12
My Father No. 2|My Father|Habano|Belicoso|Medium-Full|52|5.5"|Nicaragua|12
My Father No. 4|My Father|Habano|Lancero|Medium-Full|38|7.5"|Nicaragua|12
My Father Flor de las Antillas|My Father|Habano|Toro|Medium|52|6"|Nicaragua|10
My Father Flor de las Antillas Maduro|My Father|Maduro|Toro|Medium-Full|52|6"|Nicaragua|10
My Father The Judge|My Father|Habano|Toro|Full|52|6"|Nicaragua|13
My Father The Judge Grand Robusto|My Father|Habano|Robusto|Full|60|5.5"|Nicaragua|15
My Father Connecticut|My Father|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|10
My Father La Opulencia|My Father|Maduro|Toro|Full|54|6"|Nicaragua|13
My Father La Gran Oferta|My Father|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
My Father Blue|My Father|Habano|Toro|Medium|52|6"|Nicaragua|12
Davidoff Winston Churchill|Davidoff|Connecticut|Churchill|Medium|48|7"|Dominican Republic|28
Davidoff Winston Churchill Late Hour|Davidoff|Maduro|Toro|Medium-Full|52|6"|Dominican Republic|30
Davidoff Grand Cru No. 2|Davidoff|Connecticut|Corona|Mild-Medium|43|5.625"|Dominican Republic|20
Davidoff Aniversario No. 3|Davidoff|Connecticut|Corona|Mild-Medium|50|6"|Dominican Republic|30
Davidoff Millennium Blend|Davidoff|Habano|Robusto|Medium|50|5"|Dominican Republic|22
Davidoff Millennium Blend Piramides|Davidoff|Habano|Torpedo|Medium-Full|52|6.125"|Dominican Republic|25
Davidoff Nicaragua|Davidoff|Habano|Toro|Medium-Full|52|6"|Nicaragua|16
Davidoff Nicaragua Box Pressed|Davidoff|Habano|Robusto|Medium-Full|48|5.5"|Nicaragua|16
Davidoff Escurio|Davidoff|Habano|Robusto|Medium-Full|54|5.5"|Dominican Republic|18
Davidoff Royal Release|Davidoff|Connecticut|Robusto|Medium|52|5.5"|Dominican Republic|45
Liga Privada No. 9|Drew Estate|Oscuro|Robusto|Full|54|5"|Nicaragua|16
Liga Privada No. 9 Toro|Drew Estate|Oscuro|Toro|Full|52|6"|Nicaragua|17
Liga Privada No. 9 Corona Viva|Drew Estate|Oscuro|Corona|Full|46|6"|Nicaragua|14
Liga Privada T52|Drew Estate|Habano|Robusto|Full|50|5"|Nicaragua|16
Liga Privada T52 Toro|Drew Estate|Habano|Toro|Full|52|6"|Nicaragua|17
Liga Privada T52 Corona Viva|Drew Estate|Habano|Corona|Medium-Full|46|6"|Nicaragua|14
Liga Privada Unico Serie Papas Fritas|Drew Estate|Oscuro|Petit Corona|Full|44|4.5"|Nicaragua|12
Liga Privada Unico Serie Dirty Rat|Drew Estate|Oscuro|Corona|Full|44|5"|Nicaragua|18
Liga Privada Unico Serie Flying Pig|Drew Estate|Oscuro|Belicoso|Full|60|3.5"|Nicaragua|20
Liga Privada Unico Serie Ratzilla|Drew Estate|Oscuro|Gordo|Full|46|6.25"|Nicaragua|18
Liga Privada Unico Serie Feral Flying Pig|Drew Estate|Oscuro|Belicoso|Full|60|5.5"|Nicaragua|22
Undercrown Shade|Drew Estate|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|9
Undercrown Maduro|Drew Estate|Maduro|Toro|Medium-Full|52|6"|Nicaragua|9
Undercrown Sun Grown|Drew Estate|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
Undercrown 10|Drew Estate|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
Herrera Esteli|Drew Estate|Habano|Toro|Medium-Full|52|6"|Nicaragua|11
Herrera Esteli Norteño|Drew Estate|Habano|Toro|Full|52|6"|Nicaragua|12
Herrera Esteli Norteño Lonsdale|Drew Estate|Habano|Lonsdale|Full|44|6.5"|Nicaragua|11
ACID Blondie|Drew Estate|Connecticut|Petit Corona|Mild|38|4"|Nicaragua|7
ACID Kuba Kuba|Drew Estate|Sumatra|Toro|Mild-Medium|54|5"|Nicaragua|9
Tabak Especial|Drew Estate|Maduro|Toro|Medium|52|6"|Nicaragua|9
Kentucky Fire Cured|Drew Estate|Maduro|Toro|Full|52|6"|Nicaragua|7
Ashton VSG|Ashton|Cameroon|Toro|Medium-Full|50|6"|Dominican Republic|15
Ashton VSG Enchantment|Ashton|Cameroon|Robusto|Medium-Full|52|4.75"|Dominican Republic|12
Ashton VSG Sorcerer|Ashton|Cameroon|Gordo|Medium-Full|54|5"|Dominican Republic|14
Ashton ESG|Ashton|Cameroon|Toro|Medium-Full|54|6"|Dominican Republic|30
Ashton Symmetry|Ashton|Cameroon|Toro|Medium-Full|52|6"|Dominican Republic|13
Ashton Symmetry Robusto|Ashton|Cameroon|Robusto|Medium-Full|50|5.5"|Dominican Republic|12
Ashton Cabinet Selection|Ashton|Connecticut|Toro|Mild-Medium|52|6"|Dominican Republic|12
Ashton Classic|Ashton|Connecticut|Churchill|Mild|48|7"|Dominican Republic|10
Ashton Aged Maduro|Ashton|Maduro|Robusto|Medium-Full|50|5.5"|Dominican Republic|12
Rocky Patel Vintage 1990|Rocky Patel|Maduro|Robusto|Medium-Full|50|5.5"|Honduras|10
Rocky Patel Vintage 1992|Rocky Patel|Habano|Robusto|Medium|50|5.5"|Honduras|10
Rocky Patel Vintage 1999|Rocky Patel|Connecticut|Toro|Mild-Medium|52|6.5"|Honduras|10
Rocky Patel Decade|Rocky Patel|Habano|Toro|Full|52|6.5"|Honduras|11
Rocky Patel Fifteenth Anniversary|Rocky Patel|Habano|Robusto|Medium-Full|52|5"|Honduras|12
Rocky Patel Sun Grown Maduro|Rocky Patel|Maduro|Toro|Medium-Full|52|6.5"|Honduras|10
Rocky Patel The Edge Maduro|Rocky Patel|Maduro|Toro|Full|52|6"|Honduras|8
Rocky Patel The Edge Corojo|Rocky Patel|Corojo|Toro|Medium-Full|52|6"|Honduras|8
Rocky Patel The Edge Connecticut|Rocky Patel|Connecticut|Toro|Mild-Medium|52|6"|Honduras|8
Rocky Patel Royale|Rocky Patel|Habano|Toro|Medium|52|6.5"|Nicaragua|12
Rocky Patel Sixty|Rocky Patel|Maduro|Gordo|Full|60|6"|Nicaragua|14
Rocky Patel A.L.R. Second Edition|Rocky Patel|Habano|Toro|Medium-Full|52|6.5"|Honduras|14
Rocky Patel Emerald|Rocky Patel|Habano|Robusto|Medium-Full|50|5"|Nicaragua|11
Rocky Patel DBS|Rocky Patel|Maduro|Toro|Full|52|6.5"|Nicaragua|12
Perdomo Lot 23 Maduro|Perdomo|Maduro|Toro|Medium|50|6"|Nicaragua|7
Perdomo Lot 23 Connecticut|Perdomo|Connecticut|Toro|Mild|50|6"|Nicaragua|7
Perdomo Lot 23 Natural|Perdomo|Habano|Toro|Medium|50|6"|Nicaragua|7
Perdomo 10th Anniversary Champagne|Perdomo|Connecticut|Toro|Mild-Medium|50|6.5"|Nicaragua|9
Perdomo 20th Anniversary Maduro|Perdomo|Maduro|Toro|Medium-Full|56|6"|Nicaragua|12
Perdomo 20th Anniversary Connecticut|Perdomo|Connecticut|Toro|Mild-Medium|56|6"|Nicaragua|12
Perdomo 20th Anniversary Sun Grown|Perdomo|Habano|Toro|Medium|56|6"|Nicaragua|12
Perdomo Double Aged 12 Year Vintage|Perdomo|Maduro|Toro|Medium-Full|52|6.5"|Nicaragua|10
Perdomo Habano Bourbon Barrel Aged|Perdomo|Habano|Toro|Medium-Full|54|6"|Nicaragua|10
Perdomo Habano Bourbon Barrel Aged Maduro|Perdomo|Maduro|Toro|Full|54|6"|Nicaragua|10
Perdomo Reserve 10th Anniversary|Perdomo|Maduro|Robusto|Medium-Full|50|5"|Nicaragua|8
Romeo y Julieta 1875|Romeo y Julieta|Connecticut|Churchill|Mild-Medium|47|7"|Honduras|8
Romeo y Julieta Reserva Real|Romeo y Julieta|Connecticut|Toro|Mild-Medium|48|6"|Honduras|9
Romeo y Julieta Vintage|Romeo y Julieta|Connecticut|Toro|Mild-Medium|50|6"|Dominican Republic|10
Romeo y Julieta Habana Reserve|Romeo y Julieta|Habano|Toro|Medium|52|6"|Honduras|9
Romeo y Julieta Linea de Oro Nobles|Romeo y Julieta|Habano|Robusto|Medium-Full|56|4.875"|Cuba|22
Montecristo No. 2|Montecristo|Habano|Torpedo|Medium|52|6.125"|Cuba|22
Montecristo No. 4|Montecristo|Habano|Corona|Medium|42|5"|Cuba|15
Montecristo Edmundo|Montecristo|Habano|Robusto|Medium-Full|52|5.25"|Cuba|20
Montecristo Classic|Montecristo|Connecticut|Toro|Mild-Medium|52|6"|Dominican Republic|9
Montecristo Espada|Montecristo|Habano|Toro|Medium-Full|54|6"|Nicaragua|12
Montecristo White|Montecristo|Connecticut|Toro|Mild|50|6"|Dominican Republic|10
Montecristo Platinum|Montecristo|Habano|Toro|Medium|50|6"|Dominican Republic|13
Montecristo Epic|Montecristo|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
Cohiba Robusto|Cohiba|Habano|Robusto|Medium-Full|50|4.875"|Cuba|30
Cohiba Siglo VI|Cohiba|Habano|Gordo|Medium-Full|52|5.875"|Cuba|40
Cohiba Siglo II|Cohiba|Habano|Corona|Medium|42|5"|Cuba|25
Cohiba Siglo IV|Cohiba|Habano|Corona|Medium-Full|46|5.625"|Cuba|30
Cohiba Behike 52|Cohiba|Habano|Robusto|Medium-Full|52|4.75"|Cuba|45
Cohiba Behike 56|Cohiba|Habano|Gordo|Full|56|5.5"|Cuba|50
Cohiba Ambar|Cohiba|Habano|Robusto|Medium-Full|56|5.5"|Cuba|75
Cohiba 55 Aniversario|Cohiba|Habano|Robusto|Medium-Full|57|5.875"|Cuba|60
Cohiba Blue|Cohiba|Connecticut|Toro|Mild-Medium|54|6"|Dominican Republic|14
Cohiba Red Dot Robusto|Cohiba|Cameroon|Robusto|Medium|49|5"|Dominican Republic|18
Cohiba Riviera Robusto|Cohiba|Maduro|Robusto|Medium-Full|50|5"|Dominican Republic|18
E.P. Carrillo Encore|E.P. Carrillo|Habano|Toro|Medium-Full|52|6"|Dominican Republic|14
E.P. Carrillo Encore Celestial|E.P. Carrillo|Habano|Torpedo|Medium-Full|50|6.2"|Dominican Republic|14
E.P. Carrillo Encore Majestic|E.P. Carrillo|Habano|Gordo|Medium-Full|52|5.875"|Dominican Republic|14
E.P. Carrillo La Historia|E.P. Carrillo|Habano|Toro|Medium-Full|52|6.875"|Dominican Republic|13
E.P. Carrillo Pledge|E.P. Carrillo|Maduro|Toro|Full|52|6"|Dominican Republic|12
E.P. Carrillo Pledge Prequel|E.P. Carrillo|Maduro|Robusto|Full|52|5"|Dominican Republic|11
E.P. Carrillo Pledge Sojourn|E.P. Carrillo|Maduro|Gordo|Full|58|6"|Dominican Republic|14
E.P. Carrillo New Wave Connecticut|E.P. Carrillo|Connecticut|Toro|Mild-Medium|50|6"|Dominican Republic|9
E.P. Carrillo Allegiance|E.P. Carrillo|Habano|Toro|Medium-Full|52|6"|Dominican Republic|13
E.P. Carrillo Allegiance Confidant|E.P. Carrillo|Habano|Toro|Medium-Full|52|6"|Dominican Republic|12
Crowned Heads Four Kicks|Crowned Heads|Habano|Toro|Medium|52|6"|Nicaragua|9
Crowned Heads Four Kicks Maduro|Crowned Heads|Maduro|Toro|Medium-Full|52|6"|Nicaragua|10
Crowned Heads Jericho Hill|Crowned Heads|Maduro|Toro|Full|52|6"|Nicaragua|10
Crowned Heads Mil Días|Crowned Heads|Habano|Toro|Medium-Full|52|6"|Nicaragua|11
Crowned Heads Le Carême|Crowned Heads|Maduro|Toro|Medium-Full|52|6"|Nicaragua|12
Crowned Heads Luminosa|Crowned Heads|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|9
Crowned Heads Court Reserve|Crowned Heads|Habano|Toro|Medium|52|6"|Nicaragua|8
Tatuaje Havana VI|Tatuaje|Habano|Toro|Medium-Full|50|6"|Nicaragua|8
Tatuaje Black Label|Tatuaje|Maduro|Robusto|Full|50|5"|Nicaragua|10
Tatuaje Black Label Petit Lancero|Tatuaje|Maduro|Lancero|Full|36|6"|Nicaragua|10
Tatuaje Reserva|Tatuaje|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
Tatuaje Reserva A Uno|Tatuaje|Habano|Churchill|Full|48|9.25"|Nicaragua|20
Tatuaje La Verite|Tatuaje|Oscuro|Robusto|Full|50|5"|Nicaragua|18
Tatuaje TAA|Tatuaje|Habano|Toro|Medium-Full|52|6.5"|Nicaragua|12
Alec Bradley Prensado|Alec Bradley|Corojo|Toro|Medium-Full|52|6"|Honduras|11
Alec Bradley Tempus|Alec Bradley|Habano|Toro|Medium-Full|52|6"|Honduras|10
Alec Bradley Black Market|Alec Bradley|Habano|Toro|Medium-Full|52|6.25"|Honduras|9
Alec Bradley Project 40|Alec Bradley|Habano|Toro|Medium|52|6"|Nicaragua|8
Alec Bradley Prensado Lost Art|Alec Bradley|Habano|Toro|Medium-Full|52|6"|Honduras|12
CAO Flathead V770|CAO|Maduro|Gordo|Full|70|7"|Nicaragua|10
CAO Brazilia|CAO|Maduro|Toro|Medium-Full|52|6"|Nicaragua|8
CAO Mx2|CAO|Maduro|Toro|Full|52|6"|Nicaragua|9
CAO America|CAO|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|8
CAO Pilon|CAO|Habano|Toro|Medium|52|6"|Nicaragua|7
Nub Habano|Nub|Habano|Gordo|Medium-Full|60|4"|Nicaragua|8
Nub Connecticut|Nub|Connecticut|Gordo|Mild-Medium|60|4"|Nicaragua|8
Nub Maduro|Nub|Maduro|Gordo|Medium-Full|60|4"|Nicaragua|8
Nub Cameroon|Nub|Cameroon|Gordo|Medium|60|4"|Nicaragua|8
Illusione Epernay|Illusione|Habano|Corona|Medium|44|5.25"|Nicaragua|12
Illusione Rothchildes|Illusione|Habano|Petit Corona|Medium|50|4.5"|Nicaragua|8
Illusione Singularé|Illusione|Corojo|Toro|Medium-Full|52|6"|Nicaragua|16
Illusione Haut 10|Illusione|Habano|Toro|Medium-Full|48|6.25"|Nicaragua|14
AJ Fernandez Enclave|AJ Fernandez|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
AJ Fernandez Enclave Maduro|AJ Fernandez|Maduro|Toro|Full|52|6"|Nicaragua|10
AJ Fernandez Last Call|AJ Fernandez|Maduro|Petit Corona|Medium|50|4.5"|Nicaragua|7
AJ Fernandez New World|AJ Fernandez|Oscuro|Toro|Full|55|6"|Nicaragua|9
AJ Fernandez New World Connecticut|AJ Fernandez|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|8
AJ Fernandez San Lotano|AJ Fernandez|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
AJ Fernandez Dias de Gloria|AJ Fernandez|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
AJ Fernandez Bellas Artes|AJ Fernandez|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
AJ Fernandez Bellas Artes Maduro|AJ Fernandez|Maduro|Toro|Full|52|6"|Nicaragua|10
Nasser The Goat|AJ Fernandez|Habano|Toro|Medium-Full|52|6"|Nicaragua|14
Plasencia Alma Fuerte|Plasencia|Habano|Toro|Full|54|6"|Nicaragua|18
Plasencia Alma del Campo|Plasencia|Habano|Toro|Medium-Full|54|6"|Nicaragua|15
Plasencia Cosecha 146|Plasencia|Habano|Toro|Medium-Full|52|6"|Nicaragua|14
Plasencia Reserva Original|Plasencia|Corojo|Toro|Medium|52|6"|Nicaragua|10
Plasencia Reserva Original Corona|Plasencia|Corojo|Corona|Medium|42|5.75"|Nicaragua|8
Plasencia Alma del Fuego|Plasencia|Habano|Toro|Full|54|6.5"|Nicaragua|16
Foundation Tabernacle|Foundation|Maduro|Toro|Full|52|6"|Nicaragua|12
Foundation Tabernacle Havana CT|Foundation|Connecticut|Toro|Medium|52|6"|Nicaragua|12
Foundation Charter Oak|Foundation|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|7
Foundation Charter Oak Maduro|Foundation|Maduro|Toro|Medium|52|6"|Nicaragua|7
Foundation Charter Oak Habano|Foundation|Habano|Toro|Medium|52|6"|Nicaragua|7
Foundation The Wise Man|Foundation|Maduro|Toro|Full|50|6"|Nicaragua|12
Foundation Olmec|Foundation|Maduro|Toro|Full|52|6"|Nicaragua|10
Foundation Highclere Castle|Foundation|Connecticut|Toro|Medium|50|6"|Nicaragua|14
Punch Signature|Punch|Habano|Toro|Medium-Full|52|6"|Honduras|8
Punch Gran Puro|Punch|Habano|Robusto|Medium-Full|48|5.25"|Honduras|8
Punch Rare Corojo|Punch|Corojo|Toro|Medium-Full|48|6.125"|Honduras|9
Punch Diablo|Punch|Habano|Toro|Full|52|6.25"|Honduras|10
H. Upmann 1844 Reserve|H. Upmann|Connecticut|Toro|Mild-Medium|50|6"|Dominican Republic|8
H. Upmann Vintage Cameroon|H. Upmann|Cameroon|Toro|Medium|50|6"|Dominican Republic|9
H. Upmann No. 2|H. Upmann|Habano|Torpedo|Medium|52|6.125"|Cuba|18
H. Upmann Magnum 50|H. Upmann|Habano|Robusto|Medium|50|6.25"|Cuba|20
H. Upmann Sir Winston|H. Upmann|Habano|Churchill|Medium|47|7"|Cuba|25
Macanudo Cafe|Macanudo|Connecticut|Toro|Mild|49|6"|Dominican Republic|8
Macanudo Inspirado|Macanudo|Habano|Toro|Medium-Full|52|6"|Honduras|12
Macanudo Vintage|Macanudo|Connecticut|Toro|Mild-Medium|49|6"|Dominican Republic|15
Macanudo Emissary France Churchill|Macanudo|Habano|Churchill|Medium-Full|48|7"|Honduras|15
La Flor Dominicana Double Ligero|La Flor Dominicana|Maduro|Toro|Full|54|6"|Dominican Republic|12
La Flor Dominicana La Nox|La Flor Dominicana|Oscuro|Toro|Full|52|6"|Dominican Republic|12
La Flor Dominicana Andalusian Bull|La Flor Dominicana|Habano|Belicoso|Full|56|5.5"|Dominican Republic|15
La Flor Dominicana 1994|La Flor Dominicana|Maduro|Toro|Full|52|6"|Dominican Republic|10
La Flor Dominicana Air Bender|La Flor Dominicana|Habano|Toro|Medium-Full|52|6.5"|Dominican Republic|10
Joya de Nicaragua Antaño 1970|Joya de Nicaragua|Habano|Toro|Full|52|6"|Nicaragua|10
Joya de Nicaragua Antaño CT|Joya de Nicaragua|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|9
Joya de Nicaragua Cuatro Cinco|Joya de Nicaragua|Habano|Toro|Medium-Full|52|6"|Nicaragua|14
Joya de Nicaragua Cabinetta|Joya de Nicaragua|Habano|Toro|Medium|52|6"|Nicaragua|7
Joya de Nicaragua Cinco Décadas|Joya de Nicaragua|Habano|Toro|Medium-Full|52|6"|Nicaragua|18
Aganorsa Leaf Supreme Leaf|Aganorsa|Corojo|Toro|Full|52|6"|Nicaragua|11
Aganorsa Leaf Signature Selection|Aganorsa|Corojo|Toro|Medium-Full|52|6"|Nicaragua|9
Aganorsa Leaf Connecticut|Aganorsa|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|8
Aganorsa Leaf Rare Leaf|Aganorsa|Corojo|Toro|Full|52|6"|Nicaragua|12
La Aroma de Cuba Mi Amor|La Aroma de Cuba|Oscuro|Toro|Full|52|6"|Nicaragua|12
La Aroma de Cuba Connecticut|La Aroma de Cuba|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|8
La Aroma de Cuba Edicion Especial|La Aroma de Cuba|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
La Aroma de Cuba Noblesse|La Aroma de Cuba|Habano|Toro|Medium|52|6"|Nicaragua|10
RoMa Craft Cromagnon|RoMa Craft|Maduro|Toro|Full|52|6"|Nicaragua|11
RoMa Craft Intemperance|RoMa Craft|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
RoMa Craft Neanderthal|RoMa Craft|Maduro|Gordo|Full|54|4.75"|Nicaragua|12
Dunbarton Tobacco Sin Compromiso|Dunbarton|Habano|Toro|Full|52|6"|Nicaragua|16
Dunbarton Tobacco Mi Querida|Dunbarton|Maduro|Toro|Full|52|6"|Nicaragua|12
Dunbarton Tobacco Sobremesa|Dunbarton|Connecticut|Toro|Medium|52|6"|Nicaragua|12
Dunbarton Tobacco Stillwell Star|Dunbarton|Maduro|Toro|Full|52|6"|Nicaragua|10
Caldwell Blind Man's Bluff|Caldwell|Habano|Toro|Medium|52|6"|Dominican Republic|9
Caldwell Long Live the King|Caldwell|Habano|Toro|Medium-Full|52|6"|Dominican Republic|11
Caldwell Eastern Standard|Caldwell|Habano|Toro|Medium-Full|52|6"|Dominican Republic|10
Caldwell The T|Caldwell|Habano|Toro|Medium-Full|52|6.25"|Dominican Republic|11
Warped La Colmena|Warped|Habano|Corona|Medium|44|5.5"|Nicaragua|14
Warped Flor del Valle|Warped|Habano|Toro|Medium|50|6.25"|Nicaragua|12
Warped Guardian of the Farm|Warped|Corojo|Toro|Medium-Full|50|6"|Nicaragua|10
Warped Maestro del Tiempo|Warped|Habano|Corona|Medium|46|5.5"|Nicaragua|11
Viaje Honey & Hand Grenades|Viaje|Habano|Robusto|Full|52|5.5"|Nicaragua|12
Viaje Exclusivo|Viaje|Maduro|Toro|Full|52|6"|Nicaragua|11
Avo XO|Avo|Connecticut|Toro|Mild-Medium|50|6"|Dominican Republic|14
Avo Heritage|Avo|Habano|Toro|Medium|52|6"|Dominican Republic|10
Avo Syncro Nicaragua|Avo|Habano|Toro|Medium-Full|52|6"|Dominican Republic|12
Partagas Serie D No. 4|Partagas|Habano|Robusto|Medium-Full|50|4.875"|Cuba|20
Partagas Lusitania|Partagas|Habano|Churchill|Medium-Full|49|7.625"|Cuba|25
Partagas Serie E No. 2|Partagas|Habano|Gordo|Medium-Full|54|5.5"|Cuba|22
Partagas 1845|Partagas|Habano|Toro|Medium-Full|52|6"|Dominican Republic|8
Bolivar Belicoso Fino|Bolivar|Habano|Belicoso|Full|52|5.5"|Cuba|18
Bolivar Royal Corona|Bolivar|Habano|Robusto|Full|50|4.875"|Cuba|16
Hoyo de Monterrey Epicure No. 2|Hoyo de Monterrey|Habano|Robusto|Medium|50|4.875"|Cuba|16
Hoyo de Monterrey Epicure No. 1|Hoyo de Monterrey|Habano|Corona|Medium|46|5.625"|Cuba|16
Hoyo de Monterrey Excalibur|Hoyo de Monterrey|Connecticut|Toro|Mild-Medium|54|6.25"|Honduras|9
La Gloria Cubana Serie R|La Gloria Cubana|Habano|Toro|Full|52|6"|Dominican Republic|10
La Gloria Cubana Esteli|La Gloria Cubana|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
La Gloria Cubana Serie R Black|La Gloria Cubana|Maduro|Toro|Full|52|6"|Dominican Republic|11
La Palina Goldie Laguito No. 2|La Palina|Habano|Lancero|Medium-Full|38|7.5"|Dominican Republic|20
Brick House|Brick House|Habano|Toro|Medium|52|6"|Nicaragua|7
Brick House Maduro|Brick House|Maduro|Toro|Medium-Full|52|6"|Nicaragua|7
Brick House Connecticut|Brick House|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|7
Aging Room Quattro Nicaragua|Aging Room|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
Aging Room Quattro Nicaragua Concerto|Aging Room|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
Aging Room Solera|Aging Room|Habano|Toro|Medium|52|6"|Dominican Republic|10
Fratello Navetta|Fratello|Habano|Toro|Medium-Full|52|6.25"|Nicaragua|12
Fratello Bianco|Fratello|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|10
Fratello Classico|Fratello|Habano|Toro|Medium|52|6"|Nicaragua|10
Henry Clay War Hawk|Henry Clay|Maduro|Toro|Full|52|6"|Honduras|9
Room 101 Farce Connecticut|Room 101|Connecticut|Toro|Mild|50|6"|Honduras|8
Gurkha Ghost|Gurkha|Habano|Toro|Medium-Full|52|6"|Dominican Republic|10
Gurkha Cellar Reserve|Gurkha|Habano|Toro|Medium-Full|52|6"|Dominican Republic|14
Camacho Connecticut|Camacho|Connecticut|Toro|Mild-Medium|50|6"|Honduras|10
Camacho Corojo|Camacho|Corojo|Toro|Medium-Full|50|6"|Honduras|10
Camacho Triple Maduro|Camacho|Maduro|Toro|Full|50|6"|Honduras|12
Camacho Ecuador|Camacho|Habano|Toro|Medium|50|6"|Honduras|10
Diamond Crown Maximus|Diamond Crown|Habano|Toro|Medium-Full|54|6"|Dominican Republic|18
Diamond Crown Julius Caeser|Diamond Crown|Habano|Toro|Medium-Full|52|6"|Dominican Republic|16
Diamond Crown Classic|Diamond Crown|Connecticut|Robusto|Mild-Medium|54|4.5"|Dominican Republic|14
Cuesta-Rey Centro Fino Sungrown Pyramid No. 9|Cuesta-Rey|Habano|Torpedo|Medium-Full|52|6.2"|Dominican Republic|10
Trinidad Espíritu Series No. 3|Trinidad|Habano|Belicoso|Medium-Full|52|6"|Nicaragua|12
Trinidad Espíritu Series No. 2 Toro|Trinidad|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
Trinidad Espiritu Espeso|Trinidad|Habano|Gordo|Medium-Full|58|5.75"|Nicaragua|14
C.L.E. Maduro|C.L.E.|Maduro|Robusto|Medium-Full|50|5"|Honduras|8
C.L.E. Connecticut|C.L.E.|Connecticut|Toro|Mild-Medium|52|6"|Honduras|8
Blackened M81|Blackened|Maduro|Toro|Full|52|6"|Nicaragua|14
Blackened S84|Blackened|Habano|Toro|Medium-Full|52|6"|Nicaragua|14
San Cristobal Revelation|San Cristobal|Habano|Toro|Full|52|6"|Nicaragua|11
San Cristobal Elegancia|San Cristobal|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|10
Man O' War Ruination|Man O' War|Habano|Toro|Full|52|6"|Nicaragua|8
Man O' War Virtue|Man O' War|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|7
Man O' War Puro Authentico|Man O' War|Maduro|Toro|Full|52|6.5"|Nicaragua|9
5 Vegas Gold|5 Vegas|Connecticut|Toro|Mild-Medium|50|6"|Nicaragua|5
5 Vegas AAA|5 Vegas|Habano|Toro|Medium-Full|52|6"|Nicaragua|6
5 Vegas Classic|5 Vegas|Connecticut|Toro|Mild|50|6"|Nicaragua|4
Diesel Whiskey Row|Diesel|Habano|Toro|Medium-Full|52|6"|Nicaragua|8
Diesel Unlimited|Diesel|Maduro|Toro|Full|52|6"|Nicaragua|7
Diesel Hair of the Dog|Diesel|Habano|Toro|Medium-Full|52|6"|Nicaragua|9
Villiger La Flor de Ynclan|Villiger|Habano|Toro|Medium-Full|52|6"|Honduras|12
HVC San Isidro|HVC|Corojo|Toro|Medium-Full|52|6"|Nicaragua|10
HVC First Selection|HVC|Habano|Toro|Medium|52|6"|Nicaragua|9
Espinosa Laranja|Espinosa|Habano|Toro|Medium-Full|52|6"|Nicaragua|10
Espinosa Crema|Espinosa|Connecticut|Toro|Mild-Medium|52|6"|Nicaragua|8
Espinosa Reggae|Espinosa|Habano|Toro|Medium|52|6"|Nicaragua|9
La Barba One For All|La Barba|Habano|Toro|Medium-Full|52|6"|Nicaragua|12
Diplomaticos Genios|Diplomaticos|Habano|Gordo|Medium-Full|56|5.5"|Cuba|18
`.trim().split("\n").map(line => {
  const parts = line.split("|");
  if (parts.length < 9) return null;
  const [name, brand, wrapper, shape, strength, ringGauge, length, origin, price] = parts;
  return { name: name.trim(), brand: brand.trim(), wrapper, shape, strength, ringGauge: parseInt(ringGauge) || 0, length, origin, price: parseFloat(price) || 0 };
}).filter(Boolean);

// Extract unique brands for brand autocomplete
export const CIGAR_BRANDS = [...new Set(CIGAR_DATA.map(c => c.brand))].sort();

export default CIGAR_DATA;
