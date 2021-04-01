#include <bits/stdc++.h>

using namespace std;

bool constexpr DEBUG {false};

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




// USER CODE

struct Test {
	public:
		int n;
};

istream& operator>>(istream& s, Test& t) {
	s >> t.n;
	
	return s;
};

ostream& operator<<(ostream& s, Test& t) {
	return s;
};

// Globals
int T;
vector<Test> tests;


void readInput()
{
	Test t;
	cin >> t;
	tests.push_back(move(t));
}

int query(int l, int r)
{
	int v;
	
	cout << "? " << l << " " << r << endl;
	cout.flush();
	cin >> v;
	return v;
}

pair<int,int> queryLeft(int l, int r, int m)
{
	int prevL {l};
	//~ int mr = query(l, r);
	int mr = m;
	
	while (mr == m) {
		prevL = l;
		if (r-l == 1)
			return {l, l};
		l = (l+r)/2;
		mr = query(l, r);
	}
	
	return {prevL, l-1};
}

pair<int,int> queryRight(int l, int r, int m)
{
	int prevR {r};
	//~ int ml = query(l, r);
	int ml = m;
	
	while (ml == m) {
		prevR = r;
		if (r-l == 1)
			return {r, r};
		r = (l+r)/2;
		ml = query(l, r);
	}
	
	return {r+1, prevR};
}

void solve(Test& t)
{
	int l{1}, r{t.n};
	int m{0}, ml;
	if (t.n == 2) {
		m = query(1, 2);
		cout << "! " << (m % 2) + 1 << endl;
		return;
	}
	while (r-l > 0) {
		m = query(l, r);
		if (m-l == 0)
			ml = -1;
		else if (m-r == 0)
			ml = m;
		else
			ml = query(l, m);
		
		if (r-l == 1) {
			if (m == r)
				r = l;
			else
				l = r;
			break;
		}
		
		if (ml < m) {
			// It's in the right [m, r]
			auto p = queryRight(m, r, m);
			l = p.first;
			r = p.second;
		} else {
			// It' in the left [l, m]
			auto p = queryLeft(l, m, m);
			l = p.first;
			r = p.second;
		}
	}
	
	cout << "! " << l << endl;
	cout.flush();
}

int main (int argc, char * argv[])
{
	// Disable old C stdio compability
	ios_base::sync_with_stdio(false);
	cin.tie(0);
	
	readInput();
	
	// Solve each test
	for (auto& t : tests) {
		solve(t);
	}
	
	return 0;
}
