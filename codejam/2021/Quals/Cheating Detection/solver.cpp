#include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {true};

void debug() { if constexpr(DEBUG) cerr << endl;}

template <typename T1, typename ...T>
void debug(T1&& head, T&&... args)
{
	if constexpr(DEBUG) {
		cerr << head << " ";
		debug(args ...);
	}
}

struct custom_hash {
	static uint64_t splitmix64(uint64_t x) {
		// http://xorshift.di.unimi.it/splitmix64.c
		x += 0x9e3779b97f4a7c15;
		x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9;
		x = (x ^ (x >> 27)) * 0x94d049bb133111eb;
		return x ^ (x >> 31);
	}

	static int splitmix32(int x) {
		uint64_t z = x;
		return (splitmix64(z) & 0xffffffff);
	}

	uint64_t operator()(uint64_t x) const {
		static const uint64_t FIXED_RANDOM = chrono::steady_clock::now().time_since_epoch().count();
		return splitmix64(x + FIXED_RANDOM);
	}

	int operator()(int x) const {
		static const int FIXED_RANDOM = (chrono::steady_clock::now().time_since_epoch().count() & 0xffffffff);
		return splitmix32(x + FIXED_RANDOM);
	}
};

template <typename T>
inline T custom_ceil(T a, T b)
{
	return 1 + ((a - 1) / b);
}

template <typename T>
inline double log_b(T base, T x)
{
	return log(x)/log(base);
}

inline long double log_b(long double base, long double x)
{
	return log(x)/log(base);
}

template <typename T1, typename T2>
inline int perfect_log(T1 base, T2 x)
{
	int e = static_cast<int>(log_b(base, x));
	int best = {e};
	for (int k=-1; k < 2; ++k)
		if (pow(base, e+k) <= x)
			best = e+k;
	return best;
}

/* Fast inverse of a modulo p (p must be prime) */
template <typename T>
long long fast_inv(T a, T p) {
	long long res = 1;
	long long p2 {p-2};
	while (p2) {
		if (p2 % 2 == 0) {
			a = a * 1ll * a % p;
			p2 /= 2;
		} else {
			res = res * 1ll * a % p;
			p2--;
		}
	}
	return res;
}





// USER CODE

struct Test {
	public:
		vector<string> pl;
};

istream& operator>>(istream& s, Test& t) {
	t.pl.resize(100);
	for (int k=0; k < 100; ++k)
		s >> t.pl[k];
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T;
int P;
vector<Test> tests;


void readInput()
{
	cin >> T;
	cin >> P;
	for (int k=0; k < T; ++k) {
		Test t;
		cin >> t;
		tests.push_back(move(t));
	}
}

double h(double x)
{
	double e {exp(-x)};
	return 1 - 1/(1+e) + 0.5/(1+e);
}

double g(double x)
{
	double e {exp(-x)};
	return 1 - 1/(1+e);
}

template <class T>
double findInverse(T f, double y)
{
	double l{-3}, r{3};
	while (r-l > 1e-2) {
		double m {(l+r)/2};
		if (y < f(m))
			l = m;
		else
			r = m;
	}
	
	return (r+l)/2;
}

void solve(Test& t, int tc)
{
	int Q {10'000};
	vector<pair<int,int>> q(Q, {0, 0});
	for (int k=0; k < Q; ++k)
		q[k].second = k;
	
	for (int k=0; k < 100; ++k)
		for (int j=0; j < Q; ++j)
			if (t.pl[k][j] == '1')
				++q[j].first;
	
	sort(q.begin(), q.end());
	reverse(q.begin(), q.end());
	unordered_map<int, int> m;
	for (int k=0; k < Q; ++k)
		m[q[k].second] = k;
	//~ debug("easy qeustion", q[0].first, "hard qeustion", q.back().first);
	
	vector<pair<double,int>> cheaters;
	
	int rang {500};
	int mr {(Q-1)/rang};
	int midr {mr/2};
	
	for (int k=0; k < 100; ++k) {
		double s{0}, mid{0}, e{0};
		for (int j=0; j < Q; ++j) {
			if (m[j]/rang == 0)
				s += (t.pl[k][j] - 0x30);
			else if (m[j]/rang == midr)
				mid += (t.pl[k][j] - 0x30);
			else if (m[j]/rang == mr)
				e += (t.pl[k][j] - 0x30);
		}
		s /= rang;
		mid /= rang;
		e /= rang;
		
		double diff {s - e};
		
		double hx = findInverse(h, s);
		double gx = findInverse(g, s);
		assert(-3 <= hx && hx <= 3 && -3 <= gx && gx <= 3);
		
		double cheat = abs(h(hx+6) - e);
		double good = abs(g(gx+6) - e);
		
		if (diff < 0.6) {
			double adj = (e >= 0.4 ? 1 : pow(1+0.5-e, 3));
			//~ adj = 1;
			cheaters.push_back({diff*adj, k+1});
			debug("possible cheater", k+1, "diff", diff, "s", s, "e", e);
			if (cheat < good) {
				//~ cheaters.push_back({cheat, k+1});
				debug("super possible cheater", k+1, cheat, good, diff, hx, gx, s, e);
			}
		}
	}
	
	/*
	int rang {500};
	int mr {(Q-1)/rang};
	int midr {mr/2};
	
	for (int k=0; k < 100; ++k) {
		double s{0}, mid{0}, e{0};
		for (int j=0; j < Q; ++j) {
			if (m[j]/rang == 0)
				s += (t.pl[k][j] - 0x30);
			else if (m[j]/rang == midr)
				mid += (t.pl[k][j] - 0x30);
			else if (m[j]/rang == mr)
				e += (t.pl[k][j] - 0x30);
		}
		s /= rang;
		mid /= rang;
		e /= rang;
		
		int len = 6;
		//~ if (s == 1) {
			//~ s = mid;
			//~ len = 3;
		//~ }
		
		// get hx | h(hx) = s
		// record abs(h(hx+6) - e)
		// get gx | g(gx) = s
		// record abs(g(gx+6) - e)
		// add to the list of potential depending on results
		// from the list choose the most likely
		
		double hx = findInverse(h, s);
		double gx = findInverse(g, s);
		assert(-3 <= hx && hx <= 3 && -3 <= gx && gx <= 3);
		
		double cheat = abs(h(hx+len) - e);
		double good = abs(g(gx+len) - e);
		double diff {s - e};
		
		//~ debug("possible cheater", k+1, cheat, good, diff, hx, gx, s, e);
		if (cheat < good) {
			cheaters.push_back({cheat, k+1});
			debug("possible cheater", k+1, cheat, good, diff, hx, gx, s, e);
		}
		
		//~ 
		//~ debug("diff", diff, "s", s, "\te", e);
		//~ if (diff < 0.45) {
			//~ debug("FOUND YA", k);
			
			//~ cout << "Case #" << tc << ": " << k+1 << endl;
			//~ return;
		//~ }
	}*/
	
	if (cheaters.size() == 0)
		cout << "Case #" << tc << ": 1\n";
	else {
		sort(cheaters.begin(), cheaters.end());
		for (auto& x : cheaters)
			debug(x.second, x.first);
		cout << "Case #" << tc << ": " << cheaters[0].second << endl;
	}
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	readInput();
	
	// Solve each test
	int c{1};
	for (auto& t : tests) {
		solve(t, c);
		++c;
	}
	
	return 0;
}
