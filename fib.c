#include <unistd.h>
#include <time.h>
#include <stdlib.h>
#include <stdio.h>

#define NUM_BOXES 5
#define BA 0x01
#define BB 0x02
#define BC 0x04
#define BD 0x08
#define BE 0x10

#define RED_VAL   1
#define GREEN_VAL 2

struct fib_count 
{
	int count;
	int list[4];
};

char colors[] = 
{
	' ', 'r', 'g', 'b'
};

struct fib_count fibs[] = 
{
	{1, {0}},                                // 0
	{2, {BA, BB}},                           // 1 - A | B
	{2, {BC, BA|BB}},                        // 2 - C | AB
	{3, {BD, BA|BC, BB|BC}},                 // 3 - D | AC | BC
	{3, {BA|BD, BB|BD, BA|BB|BC}},           // 4 - AD | BD | ABC
	{3, {BE, BC|BD, BA|BB|BD}},              // 5 - E | CD | ABD
	{4, {BA|BE, BB|BE, BA|BC|BD, BB|BC|BD}}, // 6 - AE | BE | ACD | BCD
	{3, {BA|BB|BE, BC|BE, BA|BB|BC|BD}},     // 7 - ABE | CE | ABCD
	{3, {BD|BE, BA|BC|BE, BB|BC|BE}},        // 8 - DE | ACE | BCE
	{3, {BA|BD|BE, BB|BD|BE, BA|BB|BC|BE}},	 // 9 - ADE | BDE | ABCE 
	{2, {BC|BD|BE, BA|BB|BD|BE}},            // 10 - CDE | ABDE
	{2, {BA|BC|BD|BE, BB|BC|BD|BE}},         // 11 - ACDE | BCDE
	{1, {BA|BB|BC|BD|BE}},                   // 12 - ABCDE
};

void draw_box( int *b )
{
	char stra[ 3 ], strb[ 3 ], strc[ 5 ], strd[ 8 ], stre[ 11 ];
	sprintf( stra, "%c%c", colors[ b[0] ], colors[ b[0] ] );
	sprintf( strb, "%c%c", colors[ b[1] ], colors[ b[1] ] );
	sprintf( strc, "%c%c%c%c", colors[ b[2] ], colors[ b[2] ], colors[ b[2] ], colors[ b[2] ] );
	sprintf( strd, "%c%c%c%c%c%c%c", colors[ b[3] ], colors[ b[3] ], colors[ b[3] ], colors[ b[3] ], 
			 colors[ b[3] ], colors[ b[3] ], colors[ b[3] ] );
	sprintf( stre, "%c%c%c%c%c%c%c%c%c%c", colors[ b[4] ], colors[ b[4] ], colors[ b[4] ], colors[b[4]], 
			 colors[ b[4] ], colors[ b[4] ], colors[ b[4] ], colors[ b[4] ], colors[ b[4] ], colors[ b[4] ] );

	printf( "+----+--+----------+\n" );
	printf( "|%s|%s|%s|\n", strc, strb, stre );
	printf( "|%s+--+%s|\n", strc, stre );
	printf( "|%s|%s|%s|\n", strc, stra, stre );
	printf( "+----+--+%s|\n", stre );
	printf( "|%s|%s|\n", strd, stre );
	printf( "|%s|%s|\n", strd, stre );
	printf( "|%s|%s|\n", strd, stre );
	printf( "+-------+----------+\n" );
}

void set_led( int *b )
{
	int i;
	for( i = 0; i < NUM_BOXES; i++ )
	{
		printf( "Led %d = %c\n", i, colors[ b[i] ] );
	}
}

int pick_fib(int arg)
{
	if( ( arg < 0 ) || ( arg > 12 ) )
	{
		return 0;
	}

	return fibs[ arg ].list[ rand() % fibs[ arg ].count ];
}

int main( int argc, char *argv[] )
{
	int old_h = -1;
	int old_m = -1;
		
	srand( time( NULL ) );

	while( 1 )
	{
		time_t t = time( NULL) ;
				
		struct tm ltm;
		localtime_r( &t, &ltm );

		int hour = ltm.tm_hour;
		int minute = ltm.tm_min;
				
		if( hour > 12 )
		{
			hour -= 12;
		}

		printf( "time = %d:%02d\n", hour, minute );
		printf( "blink = %d\n", minute % 5 );
				
		if( ( hour != old_h ) || ( ( minute / 5 ) != ( old_m / 5 ) ) )
		{
			int timec[5], i;
		
			int hf = pick_fib( hour );
			int mf = pick_fib( minute/5 );
		
			for( i = 0; i < NUM_BOXES; i++ )
			{
				timec[i] = 0;
								
				if( hf & ( 1 << i ) )
				{
					timec[ i ] = RED_VAL;
				}
				if( mf & ( 1 << i ) )
				{
					timec[ i ] += GREEN_VAL;
				}
			}

			draw_box( timec );
			// set_led(timec);
		}
		// set_blink(minute % 5);
		old_h = hour;
		old_m = minute;
		sleep( 60 );
	}
		
	return 0;
}
