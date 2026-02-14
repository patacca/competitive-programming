#include <bits/stdc++.h>

using namespace std;


#define BOOST_FUNCTIONAL_HASH_ROTL32(x, r) (x << r) | (x >> (32 - r))

inline uint32_t hash_combine(uint32_t h1, uint32_t k1)
{
	const uint32_t c1 = 0xcc9e2d51;
	const uint32_t c2 = 0x1b873593;
	
	k1 *= c1;
	k1 = BOOST_FUNCTIONAL_HASH_ROTL32(k1,15);
	k1 *= c2;
	
	h1 ^= k1;
	h1 = BOOST_FUNCTIONAL_HASH_ROTL32(h1,13);
	h1 = h1*5+0xe6546b64;
	
	return h1;
}

vector<uint32_t> exec(string &g) {
	constexpr int stackSize = 20'000;
	vector<uint32_t> stack(stackSize);
	iota(stack.begin(), stack.end(), 0);
	
	unordered_map<uint32_t, pair<uint32_t, uint32_t>> m;
	
	for (char ch : g) {
		switch(ch) {
		case 'C':
			stack.push_back(stack.back());
			break;
		
		case 'D':
			stack.pop_back();
			break;
		
		case 'L':
			if (stack.back() < stackSize)
				return {};
			stack.back() = m[stack.back()].first;
			break;
		
		case 'P': {
			int s = stack.size();
			uint32_t h = hash_combine(stack[s-1], stack[s-2]);
			m[h] = {stack[s-1], stack[s-2]};
			stack.pop_back();
			stack.back() = h;
			break;
		}
		
		case 'R':
			if (stack.back() < stackSize)
				return {};
			stack.back() = m[stack.back()].second;
			break;
		
		case 'S': {
			int s = stack.size();
			swap(stack[s-1], stack[s-2]);
			break;
		}
		
		case 'U': {
			if (stack.back() < stackSize)
				return {};
			uint32_t b,c;
			tie(b,c) = m[stack.back()];
			stack.back() = c;
			stack.push_back(b);
			break;
		}
		}
	}
	return stack;
}

bool compare(vector<uint32_t> a, vector<uint32_t> b) {
	if (a.size() != b.size())
		return false;
	
	for (int k=0; k < (int)a.size(); ++k)
		if (a[k] != b[k])
			return false;
	return true;
}

int main() {
	string a, b;
	cin >> a >> b;
	
	vector<uint32_t> r1 = exec(a);
	vector<uint32_t> r2 = exec(b);
	
	if (compare(r1, r2))
		cout << "True\n";
	else
		cout << "False\n";
}
